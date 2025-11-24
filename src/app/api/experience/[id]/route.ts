import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ExperienceModel from "@/models/Experience";
import { experienceSchema } from "@/lib/validator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  const body = await request.json();
  const parsed = experienceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const experience = await ExperienceModel.findByIdAndUpdate(
    id,
    parsed.data,
    { new: true }
  );
  if (!experience) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(experience);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  await connectDB();
  await ExperienceModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

