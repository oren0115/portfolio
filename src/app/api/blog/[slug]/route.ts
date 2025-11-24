import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import { blogSchema } from "@/lib/validator";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogModel.findOne({ slug }).lean();
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const body = await request.json();
  const parsed = blogSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const updated = await BlogModel.findOneAndUpdate(
    { slug },
    parsed.data,
    { new: true }
  );
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  await connectDB();
  await BlogModel.findOneAndDelete({ slug });
  return NextResponse.json({ success: true });
}

