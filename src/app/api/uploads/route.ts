import { Buffer } from "buffer";
import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth";
import { uploadImageFromBuffer } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = await requireApiAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File is required" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadResult = await uploadImageFromBuffer(
    buffer,
    file.name,
    file.type
  );

  return NextResponse.json({
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  });
}

