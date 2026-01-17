import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from './StatusBadge';

export interface Complaint {
  id: string;
  type: 'Voice' | 'Text';
  status: 'Pending' | 'In Progress' | 'Verified';
  phoneNumber: string;
  createdTime: string;
}

interface ComplaintsTableProps {
  complaints: Complaint[];
}

const ComplaintsTable = ({ complaints }: ComplaintsTableProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTriggerCall = async (complaintId: string) => {
    setLoadingId(complaintId);
    console.log(`Triggering verification call for complaint: ${complaintId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingId(null);
    console.log(`Verification call triggered successfully for: ${complaintId}`);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="font-semibold text-foreground">Complaint ID</TableHead>
            <TableHead className="font-semibold text-foreground">Type</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground">Phone Number</TableHead>
            <TableHead className="font-semibold text-foreground">Created Time</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id} className="border-b border-border/50 hover:bg-muted/30">
              <TableCell className="font-medium text-foreground">{complaint.id}</TableCell>
              <TableCell className="text-muted-foreground">{complaint.type}</TableCell>
              <TableCell>
                <StatusBadge status={complaint.status} />
              </TableCell>
              <TableCell className="text-muted-foreground font-mono">{complaint.phoneNumber}</TableCell>
              <TableCell className="text-muted-foreground">{complaint.createdTime}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => handleTriggerCall(complaint.id)}
                  disabled={loadingId === complaint.id}
                  className="gap-2"
                >
                  {loadingId === complaint.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                  Trigger Verification Call
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintsTable;
