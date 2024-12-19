'use client';

import { Suspense, lazy } from 'react';
import { CircleHelp, Share } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const HelpContent = lazy(() => import('./help'));

function copyUrlToClipboard() {
  navigator.clipboard.writeText(window.location.href);
  toast.success('链接已复制');
}

export default function GeckoPageHeader() {
  return (
    <div className="flex items-center gap-x-2 pr-2">
      <Button
        variant="outline"
        className="ml-auto gap-1.5 text-sm"
        onClick={copyUrlToClipboard}
      >
        <Share className="size-3.5" />
        分享
      </Button>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <CircleHelp className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <ScrollArea className="h-96 p-4 pb-0">
            <div className="mx-auto w-full max-w-sm">
              <Suspense
                fallback={
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                }
              >
                <HelpContent />
              </Suspense>
            </div>
          </ScrollArea>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="mx-auto w-full max-w-sm">OK</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
