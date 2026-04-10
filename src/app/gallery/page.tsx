import { getProjects } from "@/actions/projects";
import { getVotingStateObj } from "@/actions/admin";
import prisma from "@/lib/db";
import GalleryClient from "./GalleryClient";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const projects = await getProjects();
  const votingStatusObj = await getVotingStateObj();
  
  // Since we also need to know who voted for what, we pull all votes
  // In a real large-scale app, we might just query the votes individually per user in the client via an API,
  // but for 32 people, passing all votes map is incredibly perfectly efficient.
  const votes = await prisma.vote.findMany(); 
  
  const votesMap: Record<string, string> = {};
  votes.forEach(v => {
    votesMap[`${v.voterName}_${v.voterTeam || 'obs'}`] = v.projectId;
  });

  return (
    <GalleryClient 
      initialProjects={projects} 
      initialVotesMap={votesMap} 
      initialStatus={votingStatusObj.status} 
    />
  );
}
