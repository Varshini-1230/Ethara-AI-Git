import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 shrink-0 z-20">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
            <CheckSquare className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            TaskMaster
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <FolderKanban className="w-5 h-5" />
          <span className="font-medium">Projects</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <CheckSquare className="w-5 h-5" />
          <span className="font-medium">Tasks</span>
        </NavLink>

        <NavLink
          to="/team"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Team</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-400 flex items-center justify-center font-bold text-white shadow-inner">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">{user?.name}</span>
            <span className="text-xs text-indigo-300/80 capitalize truncate font-medium">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
