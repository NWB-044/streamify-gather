import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StreamAuthProps {
  onAuth: (username: string) => void;
}

export const StreamAuth = ({ onAuth }: StreamAuthProps) => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1732010') {
      onAuth(username);
      toast({
        title: "Welcome!",
        description: "Successfully authenticated",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid passcode",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="passcode" className="text-sm font-medium">
                Passcode
              </label>
              <Input
                id="passcode"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 7-digit passcode"
                required
                className="text-2xl tracking-widest text-center"
                maxLength={7}
              />
            </div>
            <Button type="submit" className="w-full">
              Join Stream
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};