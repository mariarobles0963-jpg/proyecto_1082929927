import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'data', 'seed.json');

function readSeed(){
  return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

function writeSeed(data:any){
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const seed = readSeed();
    const exists = seed.products.find((p:any)=> p.is_active && p.name.toLowerCase() === body.name.toLowerCase());
    if(exists) return NextResponse.json({ error: 'Ya existe un producto activo con ese nombre.' }, { status: 409 });

    const prod = { id: uuidv4(), ...body, is_active: true };
    seed.products.push(prod);
    writeSeed(seed);
    return NextResponse.json(prod, { status: 201 });
  }catch(e){
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
