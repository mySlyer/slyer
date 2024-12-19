'use client';

import { Menu, Package2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ICON_MAP, NAV_LINKS } from '@/lib/const';
import { cn } from '@/lib/utils';

interface HamburgerMenuProps {
  className?: string;
}

export default function HamburgerMenu({ className }: HamburgerMenuProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn('shrink-0', className)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">继鹏的工具箱</span>
          </Link>
          {NAV_LINKS.map(({ name, href, icon }) => {
            const selected =
              href === '/' ? href === pathname : pathname.startsWith(href);
            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                  {
                    'text-muted-foreground': !selected,
                    'bg-muted': selected,
                  },
                )}
              >
                {ICON_MAP[icon]}
                {name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
