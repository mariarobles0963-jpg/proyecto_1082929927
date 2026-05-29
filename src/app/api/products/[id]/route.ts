import { NextResponse, type NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireRole } from '@/lib/auth';

type Product = {
  id: string;
  is_active: boolean;
} & Record<string, unknown>;

type SeedData = {
  products: Product[];
};

const filePath = path.join(process.cwd(), 'data', 'seed.json');

function readSeed(): SeedData {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SeedData;
}

function writeSeed(data: SeedData) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    requireRole(request, ['admin']);
    const body = (await request.json()) as Record<string, unknown>;
    const params = await context.params;
    const seed = readSeed();
    const idx = seed.products.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    seed.products[idx] = { ...seed.products[idx], ...body };
    writeSeed(seed);
    return NextResponse.json(seed.products[idx]);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    requireRole(request, ['admin']);
    const params = await context.params;
    const seed = readSeed();
    const idx = seed.products.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    seed.products[idx].is_active = false;
    writeSeed(seed);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
