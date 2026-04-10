export type ProjectUI = {
  id: string;
  teamNumber: number;
  title: string;
  url: string;
  description: string;
  votes: number;
  createdAt: Date;
};

export type User = {
  name: string;
  isParticipant: boolean;
  teamNumber: number | null;
};
