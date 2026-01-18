import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ComplaintsTable from '@/components/ComplaintsTable';
import { useAuth } from '@/contexts/AuthContext';

export type ComplaintStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED_PENDING_VERIFICATION"
  | "RESOLVED_CONFIRMED"
  | "REOPENED";

export interface Complaint {
  id: string;
  category: "Voice" | "Text";
  status: ComplaintStatus;
  citizenPhone: string;
  createdAt: string;
}

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    const res = await fetch(
      "http://localhost:5000/api/admin/complaints",
      {
        headers: {
          "x-admin-key": "supersecretadmin",
        },
      }
    );
    const json = await res.json();
    setComplaints(json.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchComplaints();
    }
  }, [isAuthenticated]);


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
            <ComplaintsTable complaints={complaints} refreshComplaints={fetchComplaints} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
