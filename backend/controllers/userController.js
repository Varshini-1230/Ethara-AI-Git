const { validationResult } = require('express-validator');
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    // Get task stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const tasks = await Task.find({ assignedTo: user._id });
      const completedTasks = tasks.filter(task => task.status === 'done').length;
      
      return {
        ...user.toObject(),
        taskCount: tasks.length,
        completedTasks
      };
    }));
    
    res.json({ users: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, role } = req.body;

    // Users can update their own profile, admins can update anyone
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only admins can change roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change role' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (role) user.role = role;

    await user.save();

    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Remove user from all projects
    await Project.updateMany(
      { members: user._id },
      { $pull: { members: user._id } }
    );

    // Delete user's tasks or reassign
    await Task.deleteMany({ assignedTo: user._id });

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, role } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // In a real app, you'd send an email invitation
    // For now, we'll create the user directly
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const user = new User({
      name: email.split('@')[0], // Temporary name
      email,
      password: tempPassword,
      role: role || 'member'
    });

    await user.save();

    res.status(201).json({ 
      message: 'User invited successfully',
      user: user.toJSON(),
      tempPassword // In real app, don't send this
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};