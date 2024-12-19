'use client';

import { Suspense, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useMemoizedFn } from 'ahooks';
import { Inbox } from 'lucide-react';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import GeckoQRCode from '@/components/gecko-qrcode';
import LoadingGeckoDownloadList from './table-body-loading';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { getMultiChannelDownloadQRCodeList } from '@/service/gecko';
import { useActions } from '@/lib/store';
import { GeckoPkg } from '@/lib/types/gecko';

type ChannelInfoList = Awaited<
  ReturnType<typeof getMultiChannelDownloadQRCodeList>
>;

function GeckoDownloadTableBody() {
  const searchParams = useSearchParams();
  const { data, isPending, isFetching } = useQuery({
    queryKey: ['channel-qrcode-list', searchParams.toString()],
    async queryFn() {
      const res = await fetch(`/api/gecko/qrcode?${searchParams.toString()}`);
      return (await res.json())?.channels as ChannelInfoList;
    },
    placeholderData: keepPreviousData,
  });
  const [hoveredQRCode, setHoveredQRCode] = useState<string | null>(null);
  const { setGeckoPkg } = useActions();

  const onHoverChange = useMemoizedFn(
    (hovering: boolean, geckoPkg: GeckoPkg) => {
      if (hovering && geckoPkg?.qrCodeUrl) {
        setHoveredQRCode(geckoPkg.qrCodeUrl ?? null);
        setGeckoPkg(geckoPkg);
        return;
      }
      if (!hovering) {
        setHoveredQRCode(null);
      }
    },
  );

  if (isPending || (!data?.length && isFetching)) {
    return <LoadingGeckoDownloadList />;
  }

  return (
    <TableBody
      className={cn('relative transition-opacity min-h-[100px]', {
        'opacity-50': isFetching,
      })}
    >
      {!data?.length && (
        <tr>
          <td colSpan={5}>
            <div className="flex flex-col items-center justify-center h-80">
              <Inbox className="w-40 h-40 text-muted" />
            </div>
          </td>
        </tr>
      )}
      {data?.map((channelItem) => (
        <TableRow key={channelItem.channel}>
          <TableCell className="font-medium">{channelItem.channel}</TableCell>
          {channelItem.geckoPkgs.map((geckoInfo) => (
            <TableCell key={geckoInfo.appName}>
              <GeckoQRCode
                {...geckoInfo}
                onHoverChange={(hovering) => onHoverChange(hovering, geckoInfo)}
                className={cn('opacity-100', {
                  'max-md:opacity-30':
                    hoveredQRCode && hoveredQRCode !== geckoInfo.qrCodeUrl,
                })}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </TableBody>
  );
}

export default function GeckoDownloadTableBodyWithSuspense() {
  return (
    <Suspense fallback={<LoadingGeckoDownloadList />}>
      <GeckoDownloadTableBody />
    </Suspense>
  );
}
