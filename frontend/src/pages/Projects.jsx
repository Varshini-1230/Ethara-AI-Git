import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FolderKanban, Plus, MoreVertical, Users, Calendar } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        toast.error("Failed to load projects");
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) {
      toast.error('Project name is required');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Creating project:', newProject);
    try {
      const res = await api.post('/projects', newProject);
      console.log('Project created successfully:', res.data);
      if (res.data && res.data.project) {
        setProjects([...projects, res.data.project]);
      } else {
        setProjects([...projects, res.data]);
      }
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      toast.success('Project created successfully!');
    } catch (error) {
      console.error("Failed to create project", error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track your team's projects</p>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <Card padding="py-16 px-6" className="text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <FolderKanban className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No projects found</h3>
          <p className="text-gray-600 max-w-sm mx-auto mb-6">
            Get started by creating a new project to organize your team's tasks.
          </p>
          {isAdmin && (
            <Button onClick={() => setIsModalOpen(true)}>
              Create Project
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card hover key={project._id} className="flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <button className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed font-medium">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm font-bold" title="Members">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{project.members?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm font-bold" title="Created date">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{new Date(project.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-5">
          <Input
            id="projectName"
            label="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            placeholder="e.g. Website Redesign"
            required
          />
          
          <div className="flex flex-col">
            <label htmlFor="projectDesc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="projectDesc"
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Brief description of the project"
              rows={4}
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
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
