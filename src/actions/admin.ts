"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getVotingStateObj() {
  let state = await prisma.votingState.findUnique({ where: { id: 1 } });
  if (!state) {
    state = await prisma.votingState.create({
      data: { id: 1, status: "not_started" },
    });
  }
  return state;
}

export async function setVotingState(status: "not_started" | "active" | "ended") {
  await prisma.votingState.upsert({
    where: { id: 1 },
    update: { status },
    create: { id: 1, status },
  });
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
  return { success: true };
}

export async function resetAllVotes() {
  await prisma.vote.deleteMany({});
  await setVotingState("not_started");
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
  return { success: true };
}

export async function getTopicObj() {
  let topic = await prisma.topic.findUnique({ where: { id: 1 } });
  if (!topic) {
    topic = await prisma.topic.create({
      data: { 
        id: 1, 
        content: JSON.stringify({ 
          theme1: { title: "", example: "" }, 
          theme2: { title: "", example: "" } 
        }) 
      },
    });
  }
  return topic;
}

export async function setTopicObj(data: { 
  theme1: { title: string, example: string }, 
  theme2: { title: string, example: string } 
}) {
  await prisma.topic.upsert({
    where: { id: 1 },
    update: { content: JSON.stringify(data) },
    create: { id: 1, content: JSON.stringify(data) },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
