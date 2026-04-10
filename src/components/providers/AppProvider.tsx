"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Project, HackathonState, User } from "@/types";

interface AppContextType extends HackathonState {
  login: (user: User) => void;
  logout: () => void;
  addProject: (project: Omit<Project, "id" | "votes">) => void;
  vote: (projectId: string) => void;
  removeVote: () => void;
  resetVotes: () => void;
  setVotingStatus: (status: "not_started" | "active" | "ended") => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [votingStatus, setVotingStatus] = useState<"not_started" | "active" | "ended">("not_started");

  // Initialization from local storage
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("hackathon_user");
    const storedProjects = localStorage.getItem("hackathon_projects");
    const storedVotes = localStorage.getItem("hackathon_votes");
    const storedUsers = localStorage.getItem("hackathon_registered_users");
    const storedVotingStatus = localStorage.getItem("hackathon_voting_status") as "not_started" | "active" | "ended";

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse hackathon_user");
      }
    }
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedVotes) setVotes(JSON.parse(storedVotes));
    if (storedUsers) setRegisteredUsers(JSON.parse(storedUsers));
    if (storedVotingStatus) setVotingStatus(storedVotingStatus);
    
    // Default initial mock data if no projects exist
    if (!storedProjects) {
      const mockProjects: Project[] = [
        {
          id: "mock-1",
          projectName: "AI 헬스케어 챗봇",
          teamName: "건강지킴이",
          url: "https://example.com/health",
          submitterId: "12345",
          votes: 0,
        },
        {
          id: "mock-2",
          projectName: "사내 회의실 예약 자동화",
          teamName: "인프라개선팀",
          url: "https://example.com/room",
          submitterId: "54321",
          votes: 0,
        }
      ];
      setProjects(mockProjects);
      localStorage.setItem("hackathon_projects", JSON.stringify(mockProjects));
    }
  }, []);

  // Sync to local storage whenever state changes, after mount
  useEffect(() => {
    if (isMounted) {
      if (currentUser) {
        localStorage.setItem("hackathon_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("hackathon_user");
      }
      localStorage.setItem("hackathon_projects", JSON.stringify(projects));
      localStorage.setItem("hackathon_votes", JSON.stringify(votes));
      localStorage.setItem("hackathon_registered_users", JSON.stringify(registeredUsers));
      localStorage.setItem("hackathon_voting_status", votingStatus);
    }
  }, [currentUser, projects, votes, registeredUsers, votingStatus, isMounted]);

  const login = (user: User) => {
    setCurrentUser(user);
    setRegisteredUsers((prev) => {
      // Create an ID logic simply by name and team
      const existing = prev.find(u => u.name === user.name && u.teamNumber === user.teamNumber);
      if (!existing) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addProject = (projectData: Omit<Project, "id" | "votes">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      votes: 0,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const getCurrentUserId = () => {
    if (!currentUser) return null;
    return `${currentUser.name}_${currentUser.teamNumber || 'obs'}`;
  };

  const vote = (projectId: string) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    // Check if user already voted
    const previousVote = votes[userId];
    if (previousVote) return;

    setVotes((prev) => ({ ...prev, [userId]: projectId }));
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, votes: p.votes + 1 } : p))
    );
  };

  const removeVote = () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const votedProjectId = votes[userId];
    if (!votedProjectId) return;

    setVotes((prev) => {
      const newVotes = { ...prev };
      delete newVotes[userId];
      return newVotes;
    });

    setProjects((prev) =>
      prev.map((p) =>
        p.id === votedProjectId ? { ...p, votes: Math.max(0, p.votes - 1) } : p
      )
    );
  };

  const resetVotes = () => {
    setVotes({});
    setProjects((prev) => prev.map((p) => ({ ...p, votes: 0 })));
    setVotingStatus("not_started");
  };

  // Prevent rendering unhydrated state which might cause server-client mismatch
  if (!isMounted) return null;

  return (
    <AppContext.Provider
      value={{ 
        currentUser, projects, votes, registeredUsers, votingStatus,
        login, logout, addProject, vote, removeVote, resetVotes, setVotingStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppBaseContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppBaseContext must be used within an AppProvider");
  }
  return context;
};
