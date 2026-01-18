export interface Citizen {
  id: string;
  name: string;
  phone: string;
  language?: string;
  complaintsCount: number;
  createdAt: string;
}

export interface CallLog {
  id: string;
  callSid: string;
  complaintId: string;
  direction: "INBOUND" | "OUTBOUND";
  speechResult?: string;
  aiDecision?: "CONFIRMED" | "REJECTED" | "INITIATED";
  confidence?: number;
  verifiedAt?: string;
  createdAt: string;
}
