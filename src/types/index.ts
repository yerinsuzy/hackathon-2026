export type Project = {
  id: string;
  projectName: string;
  teamName: string;
  url: string;
  submitterId: string;
  votes: number;
};

export type User = {
  name: string;
  isParticipant: boolean;
  teamNumber: string | null;
};

export type HackathonState = {
  currentUser: User | null;
  projects: Project[];
  votes: Record<string, string>; // employeeId -> projectId
  registeredUsers: User[];
  votingStatus: "not_started" | "active" | "ended";
};
