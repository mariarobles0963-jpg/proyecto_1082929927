import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hashPassword, requireRole } from '@/lib/auth';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordSalt: string;
  passwordHash: string;
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

function generateTemporaryPassword() {
  return crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
}

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ['admin']);
    const data = readUsers();
    const users = data.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
    }));

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['admin']);
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const role = body?.role === 'admin' ? 'admin' : 'empleado';

    if (!name || !email) {
      return NextResponse.json({ error: 'Nombre y email son obligatorios.' }, { status: 400 });
    }

    const data = readUsers();
    if (data.users.some((user) => user.email.toLowerCase() === email)) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese correo.' }, { status: 409 });
    }

    const tempPassword = generateTemporaryPassword();
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(tempPassword, salt);

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      passwordSalt: salt,
      passwordHash,
      isActive: true,
      mustChangePassword: true,
    };

    data.users.push(newUser);
    writeUsers(data);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          mustChangePassword: newUser.mustChangePassword,
        },
        tempPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
