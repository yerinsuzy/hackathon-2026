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
    // Determine the unique key based on participant status
    // If they aren't a participant, voterTeam is null. 
    // Prisma treats unique constraint with null carefully (in SQLite it might allow multiple nulls,
    // so we should ideally mock observer teams if needed, or simply delete their old vote manually).
    
    // First, find if they already voted
    const existingVote = await prisma.vote.findFirst({
      where: data.isParticipant
        ? { voterName: data.voterName, voterTeam: data.voterTeam }
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
        voterTeam: data.voterTeam,
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
    const existingVote = await prisma.vote.findFirst({
      where: data.isParticipant
        ? { voterName: data.voterName, voterTeam: data.voterTeam }
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
