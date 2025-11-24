import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import SkillModel from "@/models/Skill";
import { skillSchema } from "@/lib/validator";

export async function GET() {
  await connectDB();
  const skills = await SkillModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const skill = await SkillModel.create(parsed.data);
  return NextResponse.json(skill, { status: 201 });
}

