import { getMultiChannelDownloadQRCodeList } from '@/service/gecko';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const channels = await getMultiChannelDownloadQRCodeList({
    channelList: (searchParams.get('channels') || '')
      .split(',')
      .filter(Boolean),
    isTest: searchParams.get('isTest') !== 'false',
    env: searchParams.get('env') ?? undefined,
  });
  return NextResponse.json({
    channels,
  });
}
