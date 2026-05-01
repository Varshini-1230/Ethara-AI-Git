const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.getProjects = async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('members', 'name email').populate('createdBy', 'name');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email').populate('createdBy', 'name');
    }
    
    // Get task counts for each project
    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const tasks = await Task.find({ projectId: project._id });
      const completedTasks = tasks.filter(task => task.status === 'done').length;
      const totalTasks = tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        ...project.toObject(),
        taskCount: totalTasks,
        completedTasks,
        progress
      };
    }));
    
    res.json({ projects: projectsWithStats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      members: members || [req.user._id],
      createdBy: req.user._id
    });

    await project.save();
    
    // Create notification for members
    if (members && members.length > 0) {
      const notifications = members.map(memberId => ({
        message: `You were added to project "${name}"`,
        userId: memberId,
        type: 'project_added',
        relatedId: project._id,
        relatedModel: 'Project'
      }));
      await Notification.insertMany(notifications);
    }

    await project.populate('members', 'name email');
    await project.populate('createdBy', 'name');

    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, members } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or project creator
    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    if (members) project.members = members;

    await project.save();
    await project.populate('members', 'name email');

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only admin or creator can delete
    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated tasks
    await Task.deleteMany({ projectId: id });
    
    await Project.findByIdAndDelete(id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
      
      // Create notification
      await Notification.create({
        message: `You were added to project "${project.name}"`,
        userId,
        type: 'member_added',
        relatedId: project._id,
        relatedModel: 'Project'
      });
    }

    await project.populate('members', 'name email');
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.members = project.members.filter(member => member.toString() !== userId);
    await project.save();

    await project.populate('members', 'name email');
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};