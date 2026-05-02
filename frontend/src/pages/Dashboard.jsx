import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Bell } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import Card from '../components/ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/tasks/stats'),
          api.get('/notifications')
        ]);
        
        const backendStats = statsRes.data.stats;
        setStats({
          total: backendStats.total,
          completed: backendStats.done,
          pending: backendStats.todo + backendStats.in_progress,
          overdue: backendStats.overdue
        });
        
        setActivity(activityRes.data.notifications?.slice(0, 5) || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const chartData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [stats.completed, stats.pending, stats.overdue],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(4px)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        displayColors: true,
        cornerRadius: 8,
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 border-t-transparent"></div>
          <p className="text-white font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-700 mt-2 font-medium">Welcome back, {user?.name}! Here's your team's progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="flex items-center gap-5 relative overflow-hidden group hover:scale-105 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
            <ListTodo className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Total Tasks</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.total}</h3>
          </div>
        </Card>

        <Card hover className="flex items-center gap-5 relative overflow-hidden group hover:scale-105 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Completed</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.completed}</h3>
          </div>
        </Card>

        <Card hover className="flex items-center gap-5 relative overflow-hidden group hover:scale-105 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Pending</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.pending}</h3>
          </div>
        </Card>

        <Card hover className="flex items-center gap-5 relative overflow-hidden group hover:scale-105 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Overdue</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.overdue}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            {activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🚀</span>
                </div>
                <p className="font-bold text-lg text-gray-800">No recent activity yet</p>
                <p className="text-sm text-gray-600">Activity will appear once you start managing tasks.</p>
              </div>
            ) : (
              activity.map((item) => (
                <div key={item._id} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{item.message}</p>
                    <p className="text-xs text-gray-600 mt-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-8">Task Progress</h3>
          <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
            {stats.total === 0 ? (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-5xl">📭</span>
                </div>
                <p className="text-gray-500 font-bold">No tasks yet</p>
              </div>
            ) : (
              <>
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">
                    {Math.round((stats.completed / stats.total) * 100) || 0}%
                  </span>
                  <span className="text-sm font-bold text-gray-600 mt-2 uppercase tracking-widest">Done</span>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between px-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-gray-600 uppercase">Done</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs font-bold text-gray-600 uppercase">Pending</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-xs font-bold text-gray-600 uppercase">Overdue</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
