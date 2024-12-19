import { handleLarkEvent } from '@/service/lark';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await handleLarkEvent(body);
    return NextResponse.json(res || {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({});
  }
}
