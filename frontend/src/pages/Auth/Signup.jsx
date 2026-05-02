import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, User, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    
    if (result.success) {
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } else {
      const errorMsg = result.error || 'Failed to create account';
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-4 py-12">
      <div className="w-full max-w-md duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 transform rotate-3 transition-transform hover:rotate-6 duration-300">
            <CheckSquare className="w-8 h-8 text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-600 font-medium">Join the team and start managing tasks</p>
        </div>

        <Card padding="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              name="name"
              label="Full Name"
              type="text"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            
            <div className="flex flex-col">
              <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-1.5">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 text-sm font-medium transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              Sign up
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
