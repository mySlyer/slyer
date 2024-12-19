import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Jipeng's toolbox",
  description: '继鹏工作中常用的工具集合',
};

export default function RootLayout({
  header,
  children,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="flex flex-col h-screen w-full">
            {header}
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
