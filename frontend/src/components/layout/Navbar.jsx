import React, { useContext, useState, useEffect, useRef } from 'react';
import { LogOut, Menu, Bell, User, Plus, Search, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import CreateTeamModal from '../ui/CreateTeamModal';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
    
    // Close dropdowns on outside click
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0 shadow-sm">
      <div className="flex items-center gap-8">
        <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden lg:flex items-center gap-3 bg-white border border-gray-300 px-4 py-2 rounded-xl w-80 group focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
          <Search className="w-4 h-4 text-gray-500 group-focus-within:text-indigo-600" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="bg-transparent border-none outline-none text-sm font-semibold text-gray-800 w-full placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setShowCreateTeam(true)}
          className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </button>

        <CreateTeamModal 
          isOpen={showCreateTeam} 
          onClose={() => setShowCreateTeam(false)} 
        />
        
        <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            {showNotifications && (
              <NotificationDropdown 
                notifications={notifications} 
                onClose={() => setShowNotifications(false)} 
              />
            )}
          </div>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all border ${showProfile ? 'bg-slate-50 border-indigo-200 ring-4 ring-indigo-500/5' : 'border-transparent hover:bg-slate-50'}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{user?.role}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>
            {showProfile && (
              <ProfileDropdown 
                user={user} 
                onLogout={handleLogout} 
                onClose={() => setShowProfile(false)} 
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
