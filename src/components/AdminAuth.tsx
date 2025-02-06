
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export const AdminAuth = () => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Bipho' && passcode === '1732010') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminUsername', username);
      navigate('/admin');
      toast({
        title: "Welcome Admin!",
        description: "Successfully authenticated",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card p-8 w-full max-w-md space-y-6 fade-in">
        <h2 className="text-2xl font-semibold text-center">Admin Access</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="bg-secondary/50"
            />
          </div>
          <div className="relative">
            <label htmlFor="passcode" className="text-sm font-medium">
              Passcode
            </label>
            <div className="relative">
              <Input
                id="passcode"
                type={showPasscode ? "text" : "number"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="bg-secondary/50 pr-10"
                maxLength={7}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPasscode(!showPasscode)}
              >
                {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};
