export interface Citizen {
  id: string;
  name: string;
  phone: string;
  language?: string;
  complaintsCount: number;
  createdAt: string;
}

export const mockCitizens: Citizen[] = [
  {
    id: "cit-1",
    name: "Ramesh Kumar",
    phone: "+919811439714",
    language: "Hindi",
    complaintsCount: 3,
    createdAt: new Date().toISOString(),
  },
];
