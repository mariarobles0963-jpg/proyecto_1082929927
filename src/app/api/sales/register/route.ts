import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'seed.json');

function readSeed(){
  return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

function writeSeed(data:any){
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: Request){
  try{
    const { productId, quantity, userId } = await req.json();
    const seed = readSeed();
    const prod = seed.products.find((p:any)=> p.id === productId && p.is_active);
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
  }catch(e){
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
