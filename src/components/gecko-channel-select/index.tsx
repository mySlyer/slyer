'use client';

import { useCallback } from 'react';

import MultipleSelector, { Option } from '@/components/ui/multi-select';
import { Spinner } from '@/components/ui/spinner';

export default function GeckoChannelSelect({
  isTest,
  value,
  onValueChange,
  className,
}: {
  isTest?: boolean;
  value: string[] | null;
  onValueChange: (v: string[]) => void;
  className?: string;
}) {
  const selectedOptions = value?.map((v) => ({
    value: v,
    label: v,
  }));

  const onSelectedChange = useCallback(
    (selectedOptions: Option[]) => {
      onValueChange(selectedOptions.map(({ value }) => value));
    },
    [value, onValueChange],
  );

  const onSearchChannel = useCallback(
    async (keyword: string) => {
      try {
        const { channels } = (await (
          await fetch(
            `/api/gecko/channel?${new URLSearchParams({
              keyword,
              isTest: isTest ? 'true' : 'false',
            }).toString()}`,
          )
        ).json()) as { channels: { id: number; name: string }[] };
        return Array.from(
          new Set(channels.filter(Boolean).map(({ name }) => name)),
        ).map((channel) => ({
          value: channel,
          label: channel,
        }));
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    [isTest],
  );

  return (
    <MultipleSelector
      commandProps={{ className }}
      defaultOptions={selectedOptions}
      value={selectedOptions}
      onChange={onSelectedChange}
      onSearch={onSearchChannel}
      placeholder="搜索 qrcode"
      loadingIndicator={
        <p className="py-2 text-center text-sm leading-10 text-muted-foreground">
          <Spinner size="small">loading...</Spinner>
        </p>
      }
      emptyIndicator={
        <p className="w-full text-center text-sm leading-10 text-muted-foreground">
          No qrcode found
        </p>
      }
    />
  );
}
