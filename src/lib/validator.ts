import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  techStack: z.array(z.string()).default([]),
  image: z.string().url().optional().or(z.literal("")),
  link_demo: z.string().url().optional().or(z.literal("")),
  link_repo: z.string().url().optional().or(z.literal("")),
});

export const blogSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  content: z.string().min(20),
  tags: z.array(z.string()).default([]),
  coverImage: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  ),
});

export const skillSchema = z.object({
  name: z.string().min(2),
  level: z.enum(["beginner", "intermediate", "expert"]),
  category: z.enum(["frontend", "backend", "jaringan", "database"]),
  icon: z.string().optional().or(z.literal("")),
});

export const experienceSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  startDate: z.string(),
  endDate: z.string().optional().or(z.literal("present")),
  description: z.string().min(10),
  highlights: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;

