'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Excalidraw = dynamic(async () => await import('./excalidraw'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
});

export default function ExcalidrawPage() {
  return (
    <div className="flex-1 h-0">
      <Excalidraw />
    </div>
  );
}
