import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req){
  const {userId} = getAuth(req);

  if(!userId){
    return new Response("Unauthorized", { status: 401 });
  }
  return NextResponse.json({ url: `${process.env.URL_BASE}/bot/${userId.slice(5)}` });
}