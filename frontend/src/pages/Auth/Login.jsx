import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('All fields are required');
      return;
    }

    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      const errorMsg = result.error || 'Failed to login. Please check your credentials.';
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-4">
      <div className="w-full max-w-md duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 transform rotate-3 transition-transform hover:rotate-6 duration-300">
            <CheckSquare className="w-8 h-8 text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-600 font-medium">Sign in to your Team Task Manager</p>
        </div>

        <Card padding="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Sign in
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
