import { Complaint } from '@/components/ComplaintsTable';

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2026-001',
    type: 'Voice',
    status: 'Pending',
    phoneNumber: '+91 98XXX-XX234',
    createdTime: '17 Jan 2026, 09:15 AM',
  },
  {
    id: 'CMP-2026-002',
    type: 'Text',
    status: 'In Progress',
    phoneNumber: '+91 97XXX-XX156',
    createdTime: '17 Jan 2026, 08:42 AM',
  },
  {
    id: 'CMP-2026-003',
    type: 'Voice',
    status: 'Pending',
    phoneNumber: '+91 99XXX-XX789',
    createdTime: '17 Jan 2026, 07:33 AM',
  },
  {
    id: 'CMP-2026-004',
    type: 'Text',
    status: 'Verified',
    phoneNumber: '+91 96XXX-XX445',
    createdTime: '16 Jan 2026, 11:22 PM',
  },
  {
    id: 'CMP-2026-005',
    type: 'Voice',
    status: 'Pending',
    phoneNumber: '+91 95XXX-XX901',
    createdTime: '16 Jan 2026, 10:15 PM',
  },
  {
    id: 'CMP-2026-006',
    type: 'Text',
    status: 'In Progress',
    phoneNumber: '+91 94XXX-XX332',
    createdTime: '16 Jan 2026, 09:08 PM',
  },
];
