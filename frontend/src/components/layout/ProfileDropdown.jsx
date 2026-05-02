import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Shield } from 'lucide-react';

const ProfileDropdown = ({ user, onLogout, onClose }) => {
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 duration-300">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-900">{user?.name}</p>
        <p className="text-xs font-bold text-gray-500 truncate">{user?.email}</p>
        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700 border border-indigo-200">
          {user?.role}
        </div>
      </div>
      
      <div className="py-1">
        <button 
          onClick={() => handleAction('/profile')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all"
        >
          <User className="w-4 h-4" />
          View Profile
        </button>
        <button 
          onClick={() => handleAction('/settings')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        {user?.role === 'admin' && (
          <button 
            onClick={() => handleAction('/admin')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all"
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </button>
        )}
      </div>
      
      <div className="border-t border-gray-100 pt-1 mt-1">
        <button 
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-all font-black uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
