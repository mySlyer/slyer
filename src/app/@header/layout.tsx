import HamburgerMenu from '@/components/hamburger-menu';
import Nav from '@/components/nav';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className="flex w-full h-14 items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-x-4">
        <HamburgerMenu className="md:hidden" />
        <Nav className="hidden md:flex" />
      </div>
      <div className="flex items-center">
        {children}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
