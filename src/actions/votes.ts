"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function castVote(data: {
  projectId: string;
  voterName: string;
  voterTeam: number | null;
  isParticipant: boolean;
}) {
  try {
    const safeVoterTeam = data.voterTeam ? Number(data.voterTeam) : null;
    
    // First, find if they already voted
    const existingVote = await prisma.vote.findFirst({
      where: data.isParticipant
        ? { voterName: data.voterName, voterTeam: safeVoterTeam }
        : { voterName: data.voterName, isParticipant: false },
    });

    if (existingVote) {
      if (existingVote.projectId === data.projectId) {
        return { success: true }; // Already voted for this, no-op
      }
      // Delete old vote
      await prisma.vote.delete({ where: { id: existingVote.id } });
    }

    // Cast new vote
    await prisma.vote.create({
      data: {
        projectId: data.projectId,
        voterName: data.voterName,
        voterTeam: safeVoterTeam,
        isParticipant: data.isParticipant,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: "투표 실패" };
  }
}

export async function removeVote(data: {
  voterName: string;
  voterTeam: number | null;
  isParticipant: boolean;
}) {
  try {
    const safeVoterTeam = data.voterTeam ? Number(data.voterTeam) : null;

    const existingVote = await prisma.vote.findFirst({
      where: data.isParticipant
        ? { voterName: data.voterName, voterTeam: safeVoterTeam }
        : { voterName: data.voterName, isParticipant: false },
    });

    if (existingVote) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
    }

    revalidatePath("/gallery");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    return { success: false, error: "취소 실패" };
  }
}
