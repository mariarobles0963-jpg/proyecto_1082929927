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

export async function PUT(req: Request, { params }: { params: { id: string } }){
  try{
    // Only admin should call this in real app — here we assume caller is admin
    const body = await req.json();
    const seed = readSeed();
    const idx = seed.products.findIndex((p:any)=> p.id === params.id);
    if(idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    seed.products[idx] = { ...seed.products[idx], ...body };
    writeSeed(seed);
    return NextResponse.json(seed.products[idx]);
  }catch(e){
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }){
  try{
    const seed = readSeed();
    const idx = seed.products.findIndex((p:any)=> p.id === params.id);
    if(idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    seed.products[idx].is_active = false;
    writeSeed(seed);
    return NextResponse.json({ ok: true });
  }catch(e){
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
