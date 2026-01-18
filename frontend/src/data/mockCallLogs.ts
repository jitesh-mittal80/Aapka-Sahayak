export type CallDirection = 'inbound' | 'outbound';

export interface CallLog {
  id: number;
  callSid: string;
  complaintId: string;
  direction: CallDirection;
  speechResult?: string;
  aiDecision?: 'yes' | 'no';
  confidence?: number;
  verifiedAt?: string;
  createdAt: string;
}

export const mockCallLogs: CallLog[] = [
  {
    id: 1,
    callSid: "CA123abc456def",
    complaintId: "CPL-001",
    direction: "outbound",
    speechResult: "Haan, maine complaint ki thi",
    aiDecision: "yes",
    confidence: 0.92,
    verifiedAt: "2026-01-17T09:20:00Z",
    createdAt: "2026-01-17T09:15:00Z"
  },
  {
    id: 2,
    callSid: "CA789ghi012jkl",
    complaintId: "CPL-002",
    direction: "outbound",
    speechResult: "No, I did not file any complaint",
    aiDecision: "no",
    confidence: 0.88,
    createdAt: "2026-01-16T14:30:00Z"
  },
  {
    id: 3,
    callSid: "CA345mno678pqr",
    complaintId: "CPL-003",
    direction: "inbound",
    speechResult: "Yes, please verify my complaint",
    aiDecision: "yes",
    confidence: 0.95,
    verifiedAt: "2026-01-15T11:45:00Z",
    createdAt: "2026-01-15T11:40:00Z"
  },
  {
    id: 4,
    callSid: "CA901stu234vwx",
    complaintId: "CPL-004",
    direction: "outbound",
    createdAt: "2026-01-14T16:00:00Z"
  },
  {
    id: 5,
    callSid: "CA567yza890bcd",
    complaintId: "CPL-005",
    direction: "outbound",
    speechResult: "Haan ji, sahi hai",
    aiDecision: "yes",
    confidence: 0.78,
    verifiedAt: "2026-01-13T10:30:00Z",
    createdAt: "2026-01-13T10:25:00Z"
  }
];