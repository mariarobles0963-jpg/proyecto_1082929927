import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireRole } from '@/lib/auth';

type SeedConfig = {
  system_config?: {
    low_stock_threshold: number;
  };
};

const filePath = path.join(process.cwd(), 'data', 'seed.json');

function readSeed(): SeedConfig {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SeedConfig;
}

function writeSeed(data: SeedConfig) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ['admin']);
    const seed = readSeed();
    const config = seed.system_config ?? { low_stock_threshold: 5 };
    return NextResponse.json({ config }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireRole(request, ['admin']);
    const body = await request.json();
    const threshold = Number(body?.low_stock_threshold);

    if (!Number.isFinite(threshold) || threshold < 0) {
      return NextResponse.json(
        { error: 'Umbral inválido. Debe ser un número mayor o igual a 0.' },
        { status: 400 }
      );
    }

    const seed = readSeed();
    seed.system_config = { low_stock_threshold: threshold };
    writeSeed(seed);

    return NextResponse.json({ config: seed.system_config }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('autenticado') ? 401 : message.includes('permisos') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
