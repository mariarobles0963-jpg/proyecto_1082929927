import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type Product = {
  id: string;
  is_active: boolean;
  name: string;
  current_stock: number;
  price: number;
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

export async function GET() {
  try {
    const seed = readSeed();
    const products = seed.products.filter((p) => p.is_active);
    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request){
  try{
    const body = (await req.json()) as { name?: unknown } & Record<string, unknown>;
    const seed = readSeed();
    const name = typeof body.name === 'string' ? body.name.trim().toLowerCase() : '';
    const exists = seed.products.find((p) => p.is_active && p.name.toLowerCase() === name);
    if(exists) return NextResponse.json({ error: 'Ya existe un producto activo con ese nombre.' }, { status: 409 });

    const prod = { id: uuidv4(), ...body, is_active: true };
    seed.products.push(prod as Product);
    writeSeed(seed);
    return NextResponse.json(prod, { status: 201 });
  }catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
