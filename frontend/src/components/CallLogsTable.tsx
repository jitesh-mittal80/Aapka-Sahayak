import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PhoneIncoming, PhoneOutgoing, Check, X } from 'lucide-react';
import { CallLog } from "@/types/admin";

interface CallLogsTableProps {
  callLogs: CallLog[];
}

const CallLogsTable = ({ callLogs }: CallLogsTableProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'INBOUND' ? (
      <PhoneIncoming className="h-4 w-4 text-green-600" />
    ) : (
      <PhoneOutgoing className="h-4 w-4 text-blue-600" />
    );
  };

  const getAiDecisionBadge = (decision?: string) => {
    if (!decision) return <span className="text-muted-foreground">—</span>;
    
    return decision === 'CONFIRMED' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <Check className="h-3 w-3 mr-1" />
        Yes
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <X className="h-3 w-3 mr-1" />
        No
      </Badge>
    );
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return <span className="text-muted-foreground">—</span>;
    
    const percentage = Math.round(confidence * 100);
    const colorClass = percentage >= 90 
      ? 'bg-green-100 text-green-800' 
      : percentage >= 75 
        ? 'bg-yellow-100 text-yellow-800' 
        : 'bg-red-100 text-red-800';
    
    return (
      <Badge className={`${colorClass} hover:${colorClass}`}>
        {percentage}%
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-foreground">Call SID</TableHead>
            <TableHead className="font-semibold text-foreground">Complaint ID</TableHead>
            <TableHead className="font-semibold text-foreground">Direction</TableHead>
            <TableHead className="font-semibold text-foreground">Speech Result</TableHead>
            <TableHead className="font-semibold text-foreground">AI Decision</TableHead>
            <TableHead className="font-semibold text-foreground">Confidence</TableHead>
            <TableHead className="font-semibold text-foreground">Verified At</TableHead>
            <TableHead className="font-semibold text-foreground">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callLogs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-mono text-xs text-primary">{log.callSid}</TableCell>
              <TableCell className="font-medium">{log.complaintId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getDirectionIcon(log.direction)}
                  <span className="capitalize">{log.direction}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {log.speechResult || '—'}
              </TableCell>
              <TableCell>{getAiDecisionBadge(log.aiDecision)}</TableCell>
              <TableCell>{getConfidenceBadge(log.confidence)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {log.verifiedAt ? formatDate(log.verifiedAt) : '—'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(log.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CallLogsTable;