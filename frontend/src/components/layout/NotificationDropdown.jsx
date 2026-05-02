import React from 'react';
import { Bell, CheckCircle2, Clock, Info } from 'lucide-react';

const NotificationDropdown = ({ notifications = [], onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 duration-300">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
        <span className="text-[10px] font-black uppercase tracking-tighter bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-lg shadow-indigo-100">
          {notifications.length} New
        </span>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 px-5 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-500">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div key={n._id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {n.type === 'task_assigned' ? <Clock className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight mb-1">{n.message}</p>
                    <p className="text-[10px] font-bold text-gray-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/30">
          <button className="w-full py-2 text-[11px] font-black text-indigo-600 hover:text-indigo-700 hover:bg-white rounded-lg transition-all uppercase tracking-widest">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
