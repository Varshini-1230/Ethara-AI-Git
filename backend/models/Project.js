const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for member count
projectSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for task count
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
  count: true
});

// Virtual for completed tasks
projectSchema.virtual('completedTasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
  match: { status: 'done' },
  count: true
});

module.exports = mongoose.model('Project', projectSchema);