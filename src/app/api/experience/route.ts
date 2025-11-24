import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ExperienceModel from "@/models/Experience";
import { experienceSchema } from "@/lib/validator";

export async function GET() {
  await connectDB();
  const experiences = await ExperienceModel.find()
    .sort({ startDate: -1 })
    .lean();
  return NextResponse.json(experiences);
}

export async function POST(request: NextRequest) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const experience = await ExperienceModel.create(parsed.data);
  return NextResponse.json(experience, { status: 201 });
}

