import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ComplaintsTable from '@/components/ComplaintsTable';
import { mockComplaints } from '@/data/mockComplaints';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">
              Ongoing Complaints
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Review and manage active complaint cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComplaintsTable complaints={mockComplaints} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
