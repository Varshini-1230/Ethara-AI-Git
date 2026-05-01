const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    
    let filter = {};
    
    if (projectId) {
      filter.projectId = projectId;
    } else if (req.user.role !== 'admin') {
      // Members can only see tasks assigned to them or in projects they're members of
      const userProjects = await Project.find({ members: req.user._id });
      const projectIds = userProjects.map(p => p._id);
      filter.$or = [
        { assignedTo: req.user._id },
        { projectId: { $in: projectIds } }
      ];
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, projectId, assignedTo, priority, dueDate } = req.body;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin' && !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = new Task({
      title,
      projectId,
      assignedTo: assignedTo || req.user._id,
      priority: priority || 'medium',
      dueDate,
      createdBy: req.user._id
    });

    await task.save();
    
    // Create notification for assigned user
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        message: `New task assigned: "${title}"`,
        userId: assignedTo,
        type: 'task_assigned',
        relatedId: task._id,
        relatedModel: 'Task'
      });
    }

    await task.populate('assignedTo', 'name email');
    await task.populate('projectId', 'name');

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, status, priority, assignedTo, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    const project = await Project.findById(task.projectId);
    const canEdit = req.user.role === 'admin' || 
                   project.members.includes(req.user._id) || 
                   task.assignedTo.toString() === req.user._id.toString();

    if (!canEdit) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Track status change for notifications
    const oldStatus = task.status;
    
    task.title = title || task.title;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    // Create notifications
    if (status === 'done' && oldStatus !== 'done') {
      await Notification.create({
        message: `Task completed: "${task.title}"`,
        userId: task.assignedTo,
        type: 'task_completed',
        relatedId: task._id,
        relatedModel: 'Task'
      });
    }

    if (assignedTo && assignedTo.toString() !== task.assignedTo.toString()) {
      await Notification.create({
        message: `Task reassigned: "${task.title}"`,
        userId: assignedTo,
        type: 'task_assigned',
        relatedId: task._id,
        relatedModel: 'Task'
      });
    }

    await task.populate('assignedTo', 'name email');
    await task.populate('projectId', 'name');

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    const project = await Project.findById(task.projectId);
    const canDelete = req.user.role === 'admin' || 
                     project.createdBy.toString() === req.user._id.toString() ||
                     task.createdBy.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    let taskFilter = {};
    
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id });
      const projectIds = userProjects.map(p => p._id);
      taskFilter = {
        $or: [
          { assignedTo: req.user._id },
          { projectId: { $in: projectIds } }
        ]
      };
    }

    const tasks = await Task.find(taskFilter);
    
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.isOverdue()).length
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};