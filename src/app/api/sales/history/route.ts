import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'seed.json');
function readSeed(){
  return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

export async function GET(req: Request){
  try{
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const productId = url.searchParams.get('productId');
    const seed = readSeed();
    const sales = seed.sales || [];
    let res = sales;
    if(productId) res = res.filter((s:any)=> s.product_id === productId);
    if(from) res = res.filter((s:any)=> new Date(s.sold_at) >= new Date(from));
    if(to) res = res.filter((s:any)=> new Date(s.sold_at) <= new Date(to));
    return NextResponse.json(res);
  }catch(e){
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
