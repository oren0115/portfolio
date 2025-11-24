import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin, buildSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validator";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await authenticateAdmin(
    parsed.data.email,
    parsed.data.password
  );

  if (!result) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({
    id: result.user._id,
    email: result.user.email,
    role: result.user.role,
  });

  response.cookies.set(buildSessionCookie(result.token));
  return response;
}

