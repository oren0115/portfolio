import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import { blogSchema } from "@/lib/validator";

export async function GET() {
  await connectDB();
  const posts = await BlogModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const exists = await BlogModel.findOne({ slug: parsed.data.slug });
  if (exists) {
    return NextResponse.json(
      { error: "Slug already exists" },
      { status: 409 }
    );
  }
  const post = await BlogModel.create(parsed.data);
  return NextResponse.json(post, { status: 201 });
}

