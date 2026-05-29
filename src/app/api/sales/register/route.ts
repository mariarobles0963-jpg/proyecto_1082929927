import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type Product = {
  id: string;
  is_active: boolean;
  current_stock: number;
  name: string;
  price: number;
} & Record<string, unknown>;

type Sale = {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total: number;
  sold_by: string;
  sold_at: string;
};

type SeedData = {
  products: Product[];
  sales?: Sale[];
};

const filePath = path.join(process.cwd(), 'data', 'seed.json');

function readSeed(): SeedData {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SeedData;
}

function writeSeed(data: SeedData){
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const productId = typeof body?.productId === 'string' ? body.productId : '';
    const quantity = typeof body?.quantity === 'number' ? body.quantity : Number(body?.quantity);
    const userId = typeof body?.userId === 'string' ? body.userId : undefined;
    const seed = readSeed();
    const prod = seed.products.find((p) => p.id === productId && p.is_active);
    if(!prod) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    if(prod.current_stock < quantity) return NextResponse.json({ error: `Stock insuficiente. Solo quedan ${prod.current_stock} unidades.` }, { status: 409 });

    prod.current_stock -= quantity;
    const sale = {
      id: `s_${Date.now()}`,
      product_id: prod.id,
      product_name: prod.name,
      unit_price: prod.price,
      quantity,
      total: prod.price * quantity,
      sold_by: userId || 'unknown',
      sold_at: new Date().toISOString()
    };
    seed.sales = seed.sales || [];
    seed.sales.push(sale);
    writeSeed(seed);
    return NextResponse.json(sale, { status: 201 });
  }catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
