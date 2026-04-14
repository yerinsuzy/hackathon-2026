import AdminClient from "./AdminClient";
import { getProjects } from "@/actions/projects";
import { getVotingStateObj, getTopicObj } from "@/actions/admin";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const projects = await getProjects();
  const votingStatusObj = await getVotingStateObj();
  const topicObj = await getTopicObj();
  
  let parsedTopic = { title: "", description: "" };
  try {
    parsedTopic = JSON.parse(topicObj.content);
  } catch (e) {}

  const votes = await prisma.vote.findMany(); 
  
  // Since we also need `registeredUsers`, we can fetch unique voters
  // But wait, our new spec says "👥 참여자 현황: 1~8조별 그룹핑, 투표 완료자 표시".
  // Since we no longer save registered users globally, we just display people who voted!
  const votedUsers = votes.map(v => ({
    name: v.voterName,
    teamNumber: v.voterTeam,
    isParticipant: v.isParticipant
  }));

  // Create voting details object for UI
  const votingDetails: Record<string, any[]> = {};
  projects.forEach(p => votingDetails[p.id] = []);
  votes.forEach(v => {
    if (votingDetails[v.projectId]) {
      votingDetails[v.projectId].push({
        name: v.voterName,
        teamNumber: v.voterTeam,
        isParticipant: v.isParticipant
      });
    }
  });

  return (
    <AdminClient 
      initialProjects={projects} 
      votedUsers={votedUsers} 
      votingDetails={votingDetails}
      initialStatus={votingStatusObj.status as "not_started" | "active" | "ended"}
      initialTopic={parsedTopic}
    />
  );
}
