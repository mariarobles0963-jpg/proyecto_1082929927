import crypto from "crypto";
import type { NextRequest } from "next/server";
import { readJson } from "@/lib/db/reader";

export type AuthRole = "admin" | "empleado";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  passwordHash: string;
  passwordSalt: string;
  isActive: boolean;
  mustChangePassword: boolean;
}

export interface AuthTokenPayload {
  userId: string;
  name: string;
  email: string;
  role: AuthRole;
  exp: number;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

const SESSION_COOKIE_NAME = "sweetstock_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;
const HASH_ITERATIONS = 310000;
const HASH_KEYLEN = 32;
const HASH_DIGEST = "sha256";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-sweetstock-secret";

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  let encoded = value.replace(/-/g, "+").replace(/_/g, "/");
  while (encoded.length % 4 !== 0) {
    encoded += "=";
  }
  return Buffer.from(encoded, "base64").toString("utf-8");
}

export function readUsers(): AuthUser[] {
  const data = readJson<{ users: AuthUser[] }>("users");
  return data.users;
}

export function findUserByEmail(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  return (
    users.find(
      (user) => user.email.trim().toLowerCase() === normalized && user.isActive
    ) ?? null
  );
}

export function hashPassword(password: string, salt: string) {
  return crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST)
    .toString("hex");
}

export function verifyPassword(password: string, user: AuthUser) {
  try {
    const hash = hashPassword(password, user.passwordSalt);
    const expected = Buffer.from(hash, "hex");
    const actual = Buffer.from(user.passwordHash, "hex");

    if (expected.length !== actual.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function createJwt(payload: Omit<AuthTokenPayload, "exp">) {
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const headerBase64 = base64UrlEncode(JSON.stringify(header));
  const bodyBase64 = base64UrlEncode(JSON.stringify(body));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerBase64}.${bodyBase64}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${headerBase64}.${bodyBase64}.${signature}`;
}

export function verifyJwt(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [headerBase64, bodyBase64, signature] = parts;
    const expected = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerBase64}.${bodyBase64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (signatureBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(bodyBase64)) as AuthTokenPayload;
    if (typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function buildSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE_SECONDS}; ${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${secure}`;
}

export function getSessionPayloadFromRequest(request: NextRequest): AuthTokenPayload | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!cookie) {
    return null;
  }

  return verifyJwt(cookie);
}
