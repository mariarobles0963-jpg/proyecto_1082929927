import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUsers } from "@/lib/db/seedReader";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // NOTE: seed.json stores plaintext passwords for dev/seed mode.
    // In production, passwords must be hashed and compared with bcrypt.
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "dev-secret";
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, secret, { expiresIn: "24h" });

    const res = NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
