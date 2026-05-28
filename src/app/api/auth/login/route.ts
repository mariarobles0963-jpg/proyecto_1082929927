import { NextResponse } from "next/server";
import { buildSessionCookie, createJwt, findUserByEmail, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      typeof body?.email !== "string" ||
      typeof body?.password !== "string" ||
      !body.email.trim() ||
      !body.password.trim()
    ) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const user = findUserByEmail(body.email);
    if (!user || !verifyPassword(body.password, user)) {
      return NextResponse.json(
        { error: "Email o contraseña inválidos." },
        { status: 401 }
      );
    }

    const jwt = createJwt({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Inicio de sesión exitoso.",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", buildSessionCookie(jwt));
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
