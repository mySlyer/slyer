'use client';

import { ChangeEventHandler, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounceFn, useMemoizedFn } from 'ahooks';

import GeckoChannelSelect from '@/components/gecko-channel-select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

function GeckoSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const channelsInQuery = searchParams.get('channels');
  const isTestInQuery = searchParams.get('isTest');
  const env = searchParams.get('env');
  const channels = (channelsInQuery || '').split(',').filter(Boolean);
  const isTest = isTestInQuery !== 'false';

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useMemoizedFn(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        !value ? params.delete(key) : params.set(key, value);
      });

      return params.toString();
    },
  );

  const onChannelsChange = useMemoizedFn((channels: string[]) => {
    const href = `?${createQueryString({
      channels: channels.join(','),
    })}`;
    router.replace(href);
  });

  const onIsTestChange = useMemoizedFn((isTest: string) => {
    const href = `?${createQueryString({
      isTest,
      env: isTest === 'true' ? env : null,
    })}`;
    router.replace(href);
  });

  const { run: onEnvChange } = useDebounceFn<
    ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      const href = `?${createQueryString({
        env: e.target.value || '',
      })}`;
      router.replace(href);
    },
    { wait: 300 },
  );

  return (
    <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2">
      <GeckoChannelSelect
        isTest={isTest}
        value={channels}
        onValueChange={onChannelsChange}
        className="flex-1 w-auto"
      />
      <Tabs value={isTest ? 'true' : 'false'} onValueChange={onIsTestChange}>
        <TabsList>
          <TabsTrigger value="true">搜索</TabsTrigger>
          {/* <TabsTrigger value="false">线上部署</TabsTrigger> */}
        </TabsList>
      </Tabs>
      {/* {isTest && (
        <Input
          defaultValue={env ?? undefined}
          placeholder="环境名称"
          onChange={onEnvChange}
          className="w-[200px]"
        />
      )} */}
      <div className="w-[300px]"></div>
    </div>
  );
}

/**
 * https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export default function GeckoSearchFormWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2">
          <Skeleton className="flex-1 h-[40px]" />
          <Skeleton className="w-[168px] h-[40px]" />
          <Skeleton className="w-[200px] h-[40px]" />
        </div>
      }
    >
      <GeckoSearchForm />
    </Suspense>
  );
}
