import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export const AdminAuth = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, use proper authentication
    if (password === 'Kipli123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid password",
        variant: "destructive"
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card p-8 w-full max-w-md space-y-6 fade-in">
        <h2 className="text-2xl font-semibold text-center">Admin Access</h2>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary/50 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};