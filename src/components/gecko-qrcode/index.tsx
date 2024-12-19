'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { configResponsive, useMemoizedFn, useResponsive } from 'ahooks';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink } from 'lucide-react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, safeJSONParse } from '@/lib/utils';
import { GeckoPkg } from '@/lib/types/gecko';
import { useChannelID } from '@/service/gecko';
import { useStoreSnap } from '@/lib/store';

configResponsive({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  ['2xl']: 1536,
});

export default function GeckoQRCode({
  appID,
  appName,
  channel,
  deploymentID,
  qrCodeUrl,
  version,
  description,
  customDistributeRule,
  user,
  createdAt,
  error,
  onHoverChange,
  onClick,
  className,
}: {
  onHoverChange?: (hovered: boolean) => void;
  onClick?: () => void;
  className?: string;
} & GeckoPkg) {
  const responsive = useResponsive();
  const qrCodeSize = useMemo(() => {
    if (responsive?.['2xl']) {
      return 160;
    }
    return 120;
  }, [responsive]);
  const { resolvedTheme: theme } = useTheme();
  const { selectedGeckoPkg } = useStoreSnap();
  const [hovered, setHovered] = useState(false);

  const selected = selectedGeckoPkg?.version === version;
  const darkMode = theme === 'dark';

  const env = useMemo(() => {
    const distributeRule = safeJSONParse<
      {
        v?: (
          | string
          | { layer_id: string; token: string; vid: string; status: string }
        )[];
      }[]
    >(customDistributeRule)?.[0]?.v?.[0];
    if (!distributeRule) {
      return undefined;
    }
    if (typeof distributeRule === 'string') {
      return distributeRule;
    }
    return `实验 vid：${distributeRule.vid}`;
  }, [customDistributeRule]);

  const handleHoverChange = useMemoizedFn((hovered: boolean) => {
    setHovered(hovered);
    onHoverChange?.(hovered);
  });

  const { data: channelID } = useChannelID(
    { deploymentID, channel },
    hovered || !!error,
  );

  const geckoPageUrl = useMemo(() => {
    if (!channelID || !deploymentID || !version) {
      return undefined;
    }
    return `https://cloud.bytedance.net/gecko/site/app/${appID}/deployment/${deploymentID}/channel/${channelID}/package/${version}?x-resource-account=public`;
  }, [appID, deploymentID, channel, version, channelID]);

  const channelUrl = useMemo(() => {
    if (!channelID || !deploymentID) {
      return undefined;
    }
    return `https://cloud.bytedance.net/gecko/site/app/${appID}/deployment/${deploymentID}/channel/${channelID}?x-resource-account=public`;
  }, [appID, deploymentID, channel, channelID]);

  const kaniUrl = useMemo(() => {
    if (!channelID) {
      return undefined;
    }
    return `https://kani-cn.bytedance.net/approval/apply/kani_189/r%3Acn/key%3Achannel-${channelID}?actions=package_write`;
  }, [channelID]);

  if (!qrCodeUrl) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center aspect-square w-[120px] 2xl:w-[160px] cursor-pointer',
          className,
        )}
      >
        <span className="text-sm text-center">-</span>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fffa] dark:bg-[#0008]">
          <p className="text-xs text-center text-black dark:text-white p-2 break-all">
            {error?.message || '获取失败'}
          </p>
          {(!error ||
            error.type === 'pkg-not-exists' ||
            error.type === 'unknown') && (
            <div className="h-4">
              {channelUrl ? (
                <Link
                  href={channelUrl}
                  target="_blank"
                  className="text-xs hover:underline animate-fade-in"
                >
                  去 channel 页面
                </Link>
              ) : null}
            </div>
          )}
          {error?.type === 'no-permission' && (
            <div className="h-4 text-xs flex items-center gap-1">
              {kaniUrl ? (
                <>
                  让继鹏点→
                  <Link
                    href={kaniUrl}
                    target="_blank"
                    className="animate-fade-in flex items-center"
                  >
                    <Avatar className="rounded-none size-3">
                      <AvatarImage
                        src="https://lf3-cdn-tos.bytescm.com/obj/cdn-static-resource/ee/kani/static/img/small-logo.png"
                        alt="avatar"
                      />
                      <AvatarFallback>
                        <span className="text-xs">申请权限</span>
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }

  const viewNode = (
    <div
      className={cn(
        'group relative flex items-center justify-center aspect-square w-[120px] 2xl:w-[160px] cursor-pointer transition',
        { 'ring ring-offset-2 ring-slate-400 rounded-sm': selected },
        className,
      )}
      onClick={onClick}
    >
      <QRCodeSVG
        value={qrCodeUrl}
        size={qrCodeSize}
        bgColor="transparent"
        fgColor={darkMode ? 'hsl(var(--muted-foreground))' : 'black'}
      />
      <div className="absolute inset-0 opacity-0 backdrop-blur-sm transition-opacity flex flex-col items-center justify-center bg-[#fffa] dark:bg-[#0008] group-hover:opacity-100">
        <div className="text-xs text-muted-foreground">Gecko ID:</div>
        <p className="text-xs">{version}</p>
        <div className="h-5 pt-1">
          {geckoPageUrl ? (
            <Link
              href={geckoPageUrl}
              target="_blank"
              className="text-xs animate-fade-in hover:underline"
            >
              访问离线包详情页
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <HoverCard openDelay={100} closeDelay={0} onOpenChange={handleHoverChange}>
      <HoverCardTrigger asChild>{viewNode}</HoverCardTrigger>
      <HoverCardContent className="w-auto flex gap-x-4 md:hidden">
        <QRCodeSVG
          value={qrCodeUrl}
          size={300}
          bgColor="transparent"
          fgColor={darkMode ? 'hsl(var(--muted-foreground))' : 'black'}
        />
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-x-1 items-center">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{createdAt}</div>
              </div>
            </div>
            <p className="dark:text-muted-foreground text-sm w-40 text-ellipsis overflow-hidden">
              {description}
            </p>
          </div>
          <div className="flex gap-x-1">
            {typeof env === 'string' ? (
              <Badge variant="secondary">{env}</Badge>
            ) : null}
            {geckoPageUrl ? (
              <Link href={geckoPageUrl} target="_blank">
                <Avatar className="relative size-[22px] animate-fade-in">
                  <AvatarImage src="https://lf3-static.bytednsdoc.com/obj/eden-cn/4201eh7nulwpqps/logo/gecko-logo.png" />
                  <AvatarFallback>Gecko</AvatarFallback>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm bg-slate-100 dark:bg-slate-800 cursor-pointer">
                    <ExternalLink size={12} />
                  </div>
                </Avatar>
              </Link>
            ) : null}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
