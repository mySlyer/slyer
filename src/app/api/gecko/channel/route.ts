import { searchChannelInAllApps } from '@/service/gecko';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');
  const isTest = searchParams.get('isTest');

  const channels = await searchChannelInAllApps({
    keyword: keyword || '',
    isTest: isTest === 'true',
  });
  return NextResponse.json({
    channels,
  });
}
