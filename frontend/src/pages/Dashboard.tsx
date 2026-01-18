import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import Navbar from '@/components/Navbar';
import ComplaintsTable from '@/components/ComplaintsTable';
import CitizensTable from '@/components/CitizensTable';
import CallLogsTable from '@/components/CallLogsTable';
import { Citizen, CallLog } from "@/types/admin";

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
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
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

  const fetchCitizens = async () => {
    const res = await fetch("http://localhost:5000/api/admin/citizens", {
      headers: { "x-admin-key": "supersecretadmin" },
    });
    setCitizens(await res.json());
  };

  const fetchCallLogs = async () => {
    const res = await fetch("http://localhost:5000/api/admin/call-logs", {
      headers: { "x-admin-key": "supersecretadmin" },
    });
    setCallLogs(await res.json());
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchComplaints();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

      if (activeTab === "citizens") fetchCitizens();
      if (activeTab === "calllogs") fetchCallLogs();
  }, [activeTab]);

  if (!isAuthenticated) {
    return null;
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'complaints':
        return {
          title: 'Ongoing Complaints',
          description: 'Review and manage active complaint cases',
          component: <ComplaintsTable complaints={complaints} refreshComplaints={fetchComplaints} />,
        };
      case 'citizens':
        return {
          title: 'Registered Citizens',
          description: 'View all registered citizens and their details',
          component: <CitizensTable citizens={citizens} />,
        };
      case 'calllogs':
        return {
          title: 'Call Logs',
          description: 'Track verification calls and AI decisions',
          component: <CallLogsTable callLogs={callLogs} />,
        };
      default:
        return {
          title: 'Ongoing Complaints',
          description: 'Review and manage active complaint cases',
          component: <ComplaintsTable complaints={complaints} refreshComplaints={fetchComplaints} />,
        };
    }
  };

  const tabContent = getTabContent();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <Navbar>
            <SidebarTrigger className="mr-2" />
          </Navbar>
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {tabContent.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tabContent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tabContent.component}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
