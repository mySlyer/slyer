'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package2 } from 'lucide-react';

import { ICON_MAP, NAV_LINKS } from '@/lib/const';
import { cn } from '@/lib/utils';

interface NavProps {
  className?: string;
}

export default function Nav({ className }: NavProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      <Link href="/" className="flex items-center gap-2 font-semibold mr-2">
        <Package2 className="h-6 w-6" />
        <span className="">继鹏的工具箱</span>
      </Link>
      {NAV_LINKS.map(({ name, href, icon }) => {
        const selected =
          href === '/' ? href === pathname : pathname.startsWith(href);
        return (
          <Link
            key={name}
            href={href}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
              {
                'text-muted-foreground': !selected,
              },
            )}
          >
            {ICON_MAP[icon]}
            {name}
          </Link>
        );
      })}
    </div>
  );
}
