import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import TeamPage from './pages/TeamPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes (Only accessible when NOT logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          {/* Protected Routes (Only accessible when logged in) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/profile" element={<div className="p-8 text-white">Profile Page (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="p-8 text-white">Settings Page (Coming Soon)</div>} />
            <Route path="/admin" element={<div className="p-8 text-white">Admin Panel (Coming Soon)</div>} />
          </Route>
          
          {/* Default redirect based on auth happens inside PrivateRoute/PublicRoute, 
              but for the absolute root "/" we can check if it hits PrivateRoute or PublicRoute.
              The best way is a direct component or Navigate.
              Wait, since "/" is inside PrivateRoute, it will automatically protect it. Let's map "/" to PrivateRoute to handle the redirect. */}
          
          <Route path="/" element={<PrivateRoute />}>
             <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
