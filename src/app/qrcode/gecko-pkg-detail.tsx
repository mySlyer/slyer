'use client';

import { Suspense, use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useActions, useStoreSnap } from '@/lib/store';
import { safeJSONParse } from '@/lib/utils';
import { useChannelID } from '@/service/gecko';
import { GeckoPkg } from '@/lib/types/gecko';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { GECKO_DEPLOYMENT_MAP } from '@/lib/const';

function GeckoPkgDetail({
  geckoPkg,
  className,
}: {
  geckoPkg: GeckoPkg;
  className?: string;
}) {
  const {
    channel,
    deploymentID,
    appName,
    appID,
    version,
    qrCodeUrl,
    description,
    customDistributeRule,
    user,
    createdAt,
  } = geckoPkg;

  const { resolvedTheme: theme } = useTheme();

  const { data: channelID } = useChannelID(
    {
      deploymentID,
      channel,
    },
    true,
  );
  const geckoPageUrl = useMemo(() => {
    if (!channelID || !deploymentID || !version) {
      return undefined;
    }
    return `https://cloud.bytedance.net/gecko/site/app/${appID}/deployment/${deploymentID}/channel/${channelID}/package/${version}?x-resource-account=public`;
  }, [appID, deploymentID, channel, version, channelID]);

  const darkMode = theme === 'dark';

  const envInfo = useMemo(() => {
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
      return { env: distributeRule };
    }
    return { libraInfo: distributeRule };
  }, [customDistributeRule]);

  const logoUrl = GECKO_DEPLOYMENT_MAP[appID]?.logo;

  return (
    <div className={className}>
      <QRCodeSVG
        value={qrCodeUrl!}
        size={300}
        bgColor="transparent"
        fgColor={darkMode ? 'hsl(var(--muted-foreground))' : 'black'}
        className="mb-4"
      />
      <dl className="grid gap-3">
        <div className="flex items-center justify-between text-sm gap-x-2">
          <dt className="text-muted-foreground">Channel</dt>
          <dd className="truncate flex-1 w-0 text-right" title={channel}>
            {channel}
          </dd>
        </div>
        {envInfo ? (
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">
              {envInfo.libraInfo?.vid ? '实验 VID' : '环境名称'}
            </dt>
            <dd>{envInfo.libraInfo?.vid || envInfo.env}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-sm">
          <dt className="text-muted-foreground">应用名称</dt>
          <dd className="flex items-center gap-x-1">
            {logoUrl ? (
              <Avatar className="size-5 rounded-sm">
                <AvatarImage src={logoUrl} alt={appName} />
                <AvatarFallback>{appName}</AvatarFallback>
              </Avatar>
            ) : null}
            {appName}
          </dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-muted-foreground">发布者</dt>
          <dd className="flex items-center gap-x-1">
            <Avatar className="size-5">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            {user?.name}
          </dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-muted-foreground">发布时间</dt>
          <dd>{createdAt}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-muted-foreground">Gecko version ID</dt>
          <dd>{version}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-muted-foreground">离线包详情页</dt>
          <dd>
            {geckoPageUrl ? (
              <Link href={geckoPageUrl} target="_blank">
                <Avatar className="relative size-5 animate-fade-in">
                  <AvatarImage src="https://lf3-static.bytednsdoc.com/obj/eden-cn/4201eh7nulwpqps/logo/gecko-logo.png" />
                  <AvatarFallback>Gecko</AvatarFallback>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm bg-slate-100 dark:bg-slate-800 cursor-pointer">
                    <ExternalLink size={12} />
                  </div>
                </Avatar>
              </Link>
            ) : (
              '-'
            )}
          </dd>
        </div>
        <Separator />
        <p className="text-sm">描述</p>
        <p className="text-sm break-all text-muted-foreground">{description}</p>
      </dl>
    </div>
  );
}

function GeckoPkgDetailWithEmptyCheck() {
  const { selectedGeckoPkg } = useStoreSnap();
  const { setGeckoPkg } = useActions();
  const searchParams = useSearchParams();

  useEffect(() => {
    setGeckoPkg(null);
  }, [searchParams.get('env'), searchParams.get('isTest')]);

  if (!selectedGeckoPkg?.qrCodeUrl) {
    return (
      <div className="flex items-center justify-center h-80 animate-fade-in">
        <p className="text-sm text-muted-foreground">
          鼠标悬停左侧二维码，查看详情
        </p>
      </div>
    );
  }

  return (
    <GeckoPkgDetail geckoPkg={selectedGeckoPkg} className="animate-fade-in" />
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function GeckoPkgDetailWrapper() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <GeckoPkgDetailWithEmptyCheck />
    </Suspense>
  );
}
