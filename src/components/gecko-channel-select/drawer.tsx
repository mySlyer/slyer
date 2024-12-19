'use client';

import { useCallback, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const channels = [
  {
    name: 'groupon_lynx_confirm_order_page',
  },
  {
    name: 'groupon_lynx_confirm_order_page_travel',
  },
];

export default function GeckoChannelSelect({
  value,
  onValueChange,
}: {
  value: string[] | null;
  onValueChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const switchSelected = useCallback(
    (clickedChannel: string) => {
      const oldValue = value || [];
      const newValue = [...oldValue];
      const index = oldValue.indexOf(clickedChannel);
      if (index === -1) {
        newValue.push(clickedChannel);
      } else {
        newValue.splice(index, 1);
      }
      onValueChange(newValue);
    },
    [value, onValueChange],
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          选择 channel
          {value?.length ? null : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Command>
          <CommandInput placeholder="Search channel..." />
          <CommandList>
            <CommandEmpty>No channel found.</CommandEmpty>
            <CommandGroup>
              {channels.map((channel) => (
                <CommandItem
                  key={channel.name}
                  value={channel.name}
                  onSelect={(currentValue) => {
                    switchSelected(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      (value || []).includes(channel.name)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  );
}
