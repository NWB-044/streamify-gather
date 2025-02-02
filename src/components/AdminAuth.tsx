import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const AdminAuth = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, use proper authentication
    if (password === 'admin123') {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card p-8 w-full max-w-md space-y-6 fade-in">
        <h2 className="text-2xl font-semibold text-center">Admin Access</h2>
        <Input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-secondary/50"
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};