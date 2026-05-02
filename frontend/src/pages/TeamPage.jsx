import React, { useState, useEffect, useContext } from 'react';
import { Users, Plus, Mail, Shield, User, MoreVertical, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const TeamPage = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      console.log('Fetched team members:', res.data.users);
      setMembers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      if (isAdmin) toast.error("Only admins can view the team list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchMembers();
    else setLoading(false);

    window.addEventListener('team-created', fetchMembers);
    return () => window.removeEventListener('team-created', fetchMembers);
  }, [isAdmin]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/users/invite', { email: inviteEmail, role: inviteRole });
      toast.success(`Invitation sent to ${inviteEmail}`);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      fetchMembers(); // Refresh list
    } catch (error) {
      console.error('Failed to invite user:', error);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 font-bold">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100">
          <Shield className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Access Restricted</h2>
        <p className="text-gray-600 max-w-md mx-auto text-lg font-medium">
          Only administrators can manage team members and invitations. 
          Please contact your supervisor if you need access.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Team Members</h1>
          <p className="text-gray-600 mt-2 font-medium">Manage your organization's members and their roles.</p>
        </div>
        
        <Button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-6 py-3 shadow-xl shadow-indigo-100">
          <Plus className="w-5 h-5" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {members.map((member) => (
          <Card key={member._id} className="group relative hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 border-4 border-white">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <button className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                {member.email}
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                member.role === 'admin' 
                  ? 'bg-rose-100 text-rose-700 border-rose-200' 
                  : 'bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}>
                {member.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {member.role}
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                Member since {new Date(member.createdAt).toLocaleDateString()}
              </span>
              {member._id !== user.id && (
                <button className="text-rose-600 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => !isSubmitting && setIsInviteModalOpen(false)}
        title="Invite New Member"
      >
        <form onSubmit={handleInvite} className="space-y-6">
          <Input
            id="inviteEmail"
            label="Email Address"
            type="email"
            icon={Mail}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            required
          />
          
          <div className="flex flex-col">
            <label htmlFor="inviteRole" className="block text-sm font-bold text-gray-700 mb-2">
              Assigned Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setInviteRole('member')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  inviteRole === 'member' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-gray-200 hover:border-indigo-200 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${inviteRole === 'member' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <User className="w-4 h-4" />
                </div>
                <p className={`text-sm font-black ${inviteRole === 'member' ? 'text-indigo-900' : 'text-gray-900'}`}>Member</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Can manage tasks</p>
              </button>
              
              <button
                type="button"
                onClick={() => setInviteRole('admin')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  inviteRole === 'admin' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-gray-200 hover:border-indigo-200 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${inviteRole === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <p className={`text-sm font-black ${inviteRole === 'admin' ? 'text-indigo-900' : 'text-gray-900'}`}>Admin</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Full control</p>
              </button>
            </div>
          </div>
          
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-50">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsInviteModalOpen(false)}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="px-8 shadow-lg shadow-indigo-100">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamPage;
