import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AdminAuth } from '@/components/AdminAuth';
import { isAdmin } from '@/lib/auth';

const Index = () => {
  if (isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6 fade-in">
          <h1 className="text-4xl font-bold">Welcome Back, Admin</h1>
          <div className="flex gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                localStorage.removeItem('isAdmin');
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-4 bg-gradient-to-br from-secondary/50 to-background">
        <div className="max-w-md space-y-6 fade-in">
          <h1 className="text-4xl font-bold">Welcome to StreamSync</h1>
          <p className="text-lg text-muted-foreground">
            Join the stream or login as admin to start streaming.
          </p>
          <Link to="/stream">
            <Button size="lg">Join Stream</Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <AdminAuth />
      </div>
    </div>
  );
};

export default Index;