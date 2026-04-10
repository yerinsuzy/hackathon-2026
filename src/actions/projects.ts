"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function addProject(data: {
  teamNumber: number;
  title: string;
  url: string;
  description: string;
  passwordRaw: string;
}) {
  const hashedPassword = await bcrypt.hash(data.passwordRaw, 10);

  const project = await prisma.project.create({
    data: {
      teamNumber: data.teamNumber,
      title: data.title,
      url: data.url,
      description: data.description,
      password: hashedPassword,
    },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  return { success: true, project };
}

export async function getProjects() {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return projects.map((p) => ({
    ...p,
    votes: p._count.votes,
  }));
}

export async function getProjectByUserId(teamNumber: number) {
  return prisma.project.findFirst({
    where: { teamNumber },
  });
}

export async function deleteProject(projectId: string, passwordRaw: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { success: false, error: "Project not found" };

  const isValid = await bcrypt.compare(passwordRaw, project.password);
  if (!isValid) return { success: false, error: "비밀번호가 일치하지 않습니다." };

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/");
  revalidatePath("/gallery");
  return { success: true };
}

export async function updateProject(
  projectId: string,
  passwordRaw: string,
  data: {
    title: string;
    url: string;
    description: string;
  }
) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { success: false, error: "Project not found" };

  const isValid = await bcrypt.compare(passwordRaw, project.password);
  if (!isValid) return { success: false, error: "비밀번호가 일치하지 않습니다." };

  await prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      url: data.url,
      description: data.description,
    },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  return { success: true };
}
