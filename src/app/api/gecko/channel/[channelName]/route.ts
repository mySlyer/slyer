import { searchChannel, searchChannelInAllApps } from '@/service/gecko';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { channelName: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const deploymentID = Number(searchParams.get('deploymentID'));

  const channel = await searchChannel({
    keyword: params.channelName,
    deploymentID,
  });
  return NextResponse.json({
    channel,
  });
}
