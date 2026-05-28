import { NextResponse, type NextRequest } from "next/server";
import { findUserByEmail, getSessionPayloadFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const payload = getSessionPayloadFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const user = findUserByEmail(payload.email);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 401 });
  }

  return NextResponse.json(
    {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    { status: 200 }
  );
}
