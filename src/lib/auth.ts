import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import UserModel, { IUser } from "@/models/User";

export const SESSION_COOKIE = "portfolio_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    const envKeys = Object.keys(process.env).filter((key) =>
      key.includes("AUTH") || key.includes("SECRET")
    );
    throw new Error(
      `Missing AUTH_SECRET. Please define it in your .env.local file.\n` +
        `Found auth-related env vars: ${envKeys.length > 0 ? envKeys.join(", ") : "none"}\n` +
        `Make sure you have a .env.local file in the root directory with AUTH_SECRET=your_secret_string`
    );
  }
  return secret;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: "admin";
}

export interface LoginResult {
  user: IUser;
  token: string;
}

export function signSession(payload: SessionPayload) {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: SESSION_TTL_SECONDS });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

export function buildSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return null;
  }

  await connectDB();
  const existing = await UserModel.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const user = await UserModel.create({
    email: adminEmail.toLowerCase(),
    passwordHash,
    role: "admin",
  });
  return user;
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<LoginResult | null> {
  await seedAdminUser();
  await connectDB();
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;
  const token = signSession({
    userId: user._id.toString(),
    email: user.email,
    role: "admin",
  });
  return { user, token };
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireApiAdmin(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

