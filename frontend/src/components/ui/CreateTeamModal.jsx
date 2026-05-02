import React, { useState } from 'react';
import { Users, Mail, Plus, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CreateTeamModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    members: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Team name and email are required');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid team email');
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting team:', formData);
    
    try {
      // Split members by comma or space and filter empty strings
      const memberEmails = formData.members
        ? formData.members.split(/[,\s]+/).filter(email => email.trim() !== '')
        : [];

      // Validate member emails
      const invalidEmails = memberEmails.filter(email => !validateEmail(email));
      if (invalidEmails.length > 0) {
        toast.error(`Invalid member email: ${invalidEmails[0]}`);
        setIsSubmitting(false);
        return;
      }

      const response = await api.post('/teams', {
        name: formData.name,
        email: formData.email,
        members: memberEmails
      });

      console.log('Team created successfully:', response.data);
      toast.success('Team created successfully!');
      
      // Dispatch event to refresh team list if needed
      window.dispatchEvent(new Event('team-created'));
      
      if (onRefresh) onRefresh();
      onClose();
      setFormData({ name: '', email: '', members: '' });
    } catch (error) {
      console.error('Failed to create team:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create team. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Team"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="name"
          name="name"
          label="Team Name"
          placeholder="e.g. Design Systems"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          id="email"
          name="email"
          label="Team Email"
          type="email"
          placeholder="team@company.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col">
          <label htmlFor="members" className="block text-sm font-bold text-slate-700 mb-2">
            Add Members (comma-separated emails)
          </label>
          <textarea
            id="members"
            name="members"
            className="block w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 min-h-[100px]"
            placeholder="colleague1@company.com, colleague2@company.com"
            value={formData.members}
            onChange={handleChange}
          />
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="px-8 shadow-xl shadow-indigo-100">
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamModal;
