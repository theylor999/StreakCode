
"use client";

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, Terminal, Sparkles, Calendar, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDailyPage = searchParams.get('daily') === 'true';

  const navLinks = [
     {
      href: "/daily-challenge",
      label: "Desafio Diário",
      icon: <Calendar className="h-4 w-4 text-accent" />,
      active: (path: string) => path === "/daily-challenge" || isDailyPage
    },
    {
      href: "/custom-challenges",
      label: "Personalizados",
      icon: <Sparkles className="h-4 w-4 text-accent" />,
      active: (path: string) => (path === "/custom-challenges" || path.startsWith('/challenge/custom-')) && !isDailyPage
    },
    {
      href: "/challenges/python",
      label: "Python",
      active: (path: string) => (path === "/challenges/python" || path.startsWith('/challenge/python-')) && !isDailyPage
    },
    {
      href: "/history",
      label: "Histórico",
      active: (path: string) => path === "/history"
    },
    {
      href: "/how-it-works",
      label: "Sobre",
      active: (path: string) => path === "/how-it-works"
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Terminal className="h-6 w-6 text-accent" />
            <span className="font-bold font-headline sm:inline-block">
              StreakCode
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1.5 font-medium",
                link.active(pathname) && "text-foreground"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="mr-6 flex items-center space-x-2 mb-4" onClick={() => setIsSheetOpen(false)}>
                    <Terminal className="h-6 w-6 text-accent" />
                    <span className="font-bold font-headline">StreakCode</span>
                  </Link>
                  {navLinks.map(link => (
                     <Link 
                        key={link.href}
                        href={link.href} 
                        onClick={() => setIsSheetOpen(false)} 
                        className={cn(
                          "text-lg font-medium flex items-center gap-2 text-foreground/80",
                          link.active(pathname) && "text-foreground font-bold"
                        )}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
