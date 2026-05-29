import { NextResponse, type NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

type Sale = {
  product_id: string;
  sold_at: string;
} & Record<string, unknown>;

type SeedData = {
  sales?: Sale[];
};

const filePath = path.join(process.cwd(), 'data', 'seed.json');
function readSeed(): SeedData {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SeedData;
}

export async function GET(req: NextRequest){
  try{
    const url = new URL(req.url);
    let from = url.searchParams.get('from');
    let to = url.searchParams.get('to');
    const productId = url.searchParams.get('productId');
    const seed = readSeed();
    const sales = seed.sales ?? [];
    let res = sales;

    if (!from && !to) {
      const now = new Date();
      from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
    }

    if(productId) res = res.filter((s)=> s.product_id === productId);
    if(from) res = res.filter((s)=> new Date(s.sold_at) >= new Date(from));
    if(to) res = res.filter((s)=> new Date(s.sold_at) <= new Date(to));
    return NextResponse.json(res);
  }catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
