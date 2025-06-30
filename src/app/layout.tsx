import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'StreakCode',
  description: 'Treine para entrevistas de programação com desafios diários de algoritmos em Python.',
  keywords: ['python', 'code', 'programming', 'interview', 'algorithms', 'desafios', 'programação'],
};

const HeaderSkeleton = () => (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-6">
                <Skeleton className="h-6 w-24 hidden md:block" />
                <Skeleton className="h-6 w-24 hidden md:block" />
                <Skeleton className="h-6 w-24 hidden md:block" />
                <Skeleton className="h-10 w-10" />
            </div>
        </div>
    </header>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased bg-background text-foreground")}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<HeaderSkeleton />}>
              <Header />
            </Suspense>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
