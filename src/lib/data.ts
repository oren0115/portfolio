import "server-only";

import BlogModel, { IBlog } from "@/models/Blog";
import ExperienceModel, { IExperience } from "@/models/Experience";
import ProjectModel, { IProject } from "@/models/Project";
import SkillModel, { ISkill } from "@/models/Skill";
import type { WithId } from "@/types/content";

import { connectDB } from "./db";

const toPlain = <T>(doc: T): T =>
  JSON.parse(JSON.stringify(doc)) as unknown as T;

export async function getProjects(): Promise<WithId<IProject>[]> {
  await connectDB();
  const projects = await ProjectModel.find().sort({ createdAt: -1 }).lean();
  return toPlain(projects);
}

export async function getProjectById(id: string): Promise<WithId<IProject> | null> {
  await connectDB();
  const project = await ProjectModel.findById(id).lean();
  return project ? toPlain(project) : null;
}

export async function getBlogPosts(): Promise<WithId<IBlog>[]> {
  await connectDB();
  const posts = await BlogModel.find().sort({ createdAt: -1 }).lean();
  return toPlain(posts);
}

export async function getBlogBySlug(slug: string): Promise<WithId<IBlog> | null> {
  await connectDB();
  const blog = await BlogModel.findOne({ slug }).lean();
  return blog ? toPlain(blog) : null;
}

export async function getSkills(): Promise<WithId<ISkill>[]> {
  await connectDB();
  const skills = await SkillModel.find().sort({ createdAt: -1 }).lean();
  return toPlain(skills);
}

export async function getExperiences(): Promise<WithId<IExperience>[]> {
  await connectDB();
  const experiences = await ExperienceModel.find()
    .sort({ startDate: -1 })
    .lean();
  return toPlain(experiences);
}

