import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireRole } from '@/lib/auth';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
} & Record<string, unknown>;

type UsersData = {
  users: User[];
};

const filePath = path.join(process.cwd(), 'data', 'users.json');

function readUsers(): UsersData {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as UsersData;
}

function writeUsers(data: UsersData) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    requireRole(request, ['admin']);
    const params = await context.params;
    const data = readUsers();
    const user = data.users.find((u) => u.id === params.id);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    requireRole(request, ['admin']);
    const params = await context.params;
    const body = await request.json();
    const data = readUsers();
    const userIndex = data.users.findIndex((u) => u.id === params.id);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    const user = data.users[userIndex];
    const updated = {
      ...user,
      role: body.role ?? user.role,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : user.isActive,
      mustChangePassword:
        typeof body.mustChangePassword === 'boolean'
          ? body.mustChangePassword
          : user.mustChangePassword,
    };

    data.users[userIndex] = updated;
    writeUsers(data);

    return NextResponse.json({ user: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
