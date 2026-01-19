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
  citizens?: Citizen[];
}

const CitizensTable = ({ citizens = [] }: CitizensTableProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Citizen ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Complaints</TableHead>
            <TableHead>Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citizens.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No citizens found
              </TableCell>
            </TableRow>
          ) : (
            citizens.map((citizen) => (
              <TableRow key={citizen.id}>
                <TableCell>{citizen.id}</TableCell>
                <TableCell>{citizen.name}</TableCell>
                <TableCell>{citizen.phone}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {citizen.language || 'Not specified'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{citizen.complaintsCount}</Badge>
                </TableCell>
                <TableCell>
                  {formatDate(citizen.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CitizensTable;
