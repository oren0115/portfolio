import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ProjectModel from "@/models/Project";
import { projectSchema } from "@/lib/validator";

export async function GET() {
  await connectDB();
  const projects = await ProjectModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const project = await ProjectModel.create(parsed.data);
  return NextResponse.json(project, { status: 201 });
}

