import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckCircle2, Circle, Clock, Filter, Trash2 } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignee: '', 
    status: 'todo',
    projectId: '' 
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data.tasks || []);
        
        // Also fetch projects for the task creation dropdown
        const projRes = await api.get('/projects');
        setProjects(projRes.data.projects || []);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        toast.error("Failed to load tasks");
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.projectId) {
      toast.error('Title and Project are required');
      return;
    }

    setIsSubmitting(true);
    console.log('Creating task:', newTask);
    try {
      const res = await api.post('/tasks', newTask);
      console.log('Task created successfully:', res.data);
      if (res.data && res.data.task) {
        setTasks([...tasks, res.data.task]);
      } else {
        setTasks([...tasks, res.data]); // fallback
      }
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', assignee: '', status: 'todo', projectId: '' });
      toast.success('Task created successfully!');
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    console.log('Deleting task:', taskToDelete._id);
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      console.log('Task deleted successfully');
      setTasks(tasks.filter(t => t._id !== taskToDelete._id));
      toast.success('Task deleted successfully');
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const assigneeId = typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo;
    if (filter === 'mine') return assigneeId === user?.id;
    if (filter === 'completed') return task.status === 'done';
    if (filter === 'pending') return task.status === 'todo' || task.status === 'in_progress';
    return true; // 'all'
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <Circle className="w-5 h-5 text-slate-400 hover:text-slate-500 transition-colors" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your daily activities</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('mine')}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${filter === 'mine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mine
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${filter === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${filter === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Done
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card padding="py-16 px-6" className="text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <CheckCircle2 className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              Try changing your filters or create a new task to get started.
            </p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Create Task
            </Button>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const assigneeName = task.assignedTo?.name || 'Unassigned';
            return (
              <div key={task._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => updateTaskStatus(task._id, task.status === 'done' ? 'todo' : 'done')}
                    className="mt-0.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                    title={task.status === 'done' ? "Mark as pending" : "Mark as completed"}
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <div>
                    <h3 className={`text-base font-bold ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-1 font-medium">{task.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pl-9 sm:pl-0 shrink-0">
                  <div className="flex items-center gap-2" title="Assignee">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[10px] font-black text-indigo-600">
                        {assigneeName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-gray-700 hidden sm:inline-block max-w-[100px] truncate">{assigneeName}</span>
                    </div>
                  </div>
                  
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition-all ${
                      task.status === 'done' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' :
                      task.status === 'in_progress' ? 'bg-amber-100 border-amber-200 text-amber-700' :
                      'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-1"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-5">
          <Input
            id="taskTitle"
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            placeholder="What needs to be done?"
            required
          />
          
          <div className="flex flex-col">
            <label htmlFor="taskProject" className="block text-sm font-medium text-slate-700 mb-1.5">
              Project
            </label>
            <select
              id="taskProject"
              value={newTask.projectId}
              onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
              required
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm transition-colors duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="taskDesc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="taskDesc"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Add more details about this task..."
              rows={3}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm transition-colors duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => !isDeleting && setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${taskToDelete?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Tasks;
