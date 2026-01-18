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
import { Citizen } from "@/types/admin";

interface CitizensTableProps {
  citizens: Citizen[];
}

const CitizensTable = ({ citizens }: CitizensTableProps) => {
    const formatDate = (dateString?: string) => {
      if (!dateString) return '—';
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    };


  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-foreground">Citizen ID</TableHead>
            <TableHead className="font-semibold text-foreground">Name</TableHead>
            <TableHead className="font-semibold text-foreground">Phone</TableHead>
            <TableHead className="font-semibold text-foreground">Language</TableHead>
            <TableHead className="font-semibold text-foreground">Complaints</TableHead>
            <TableHead className="font-semibold text-foreground">Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citizens.map((citizen) => (
            <TableRow key={citizen.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-primary">{citizen.id}</TableCell>
              <TableCell className="font-medium">{citizen.name}</TableCell>
              <TableCell className="text-muted-foreground">{citizen.phone}</TableCell>
              <TableCell>
                <Badge variant="secondary">{citizen.language || 'Not specified'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-semibold">
                  {citizen.complaintsCount}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(citizen.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CitizensTable;