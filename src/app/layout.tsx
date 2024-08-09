import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import '@/styles/globals.css';

import { EdgeStoreProvider } from '@/lib/edgestore';
import { cn } from '@/lib/utils';

import { siteConfig } from '@/constant/config';
import { Footer } from '@/layout/footer';
import { Header } from '@/layout/header';
import { ThemeProvider } from '@/theme-provider';
import { Toaster } from '@/ui/sonner';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_GB',
  },
  creator: '@kleva-j',
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    // creator: '@th_clarence',
  },
  authors: [
    {
      name: 'Michael Obasi',
      url: 'https://michaelobasi.dev/portfolio_v3/',
    },
  ],
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <EdgeStoreProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='relative dark:bg-slate-950 flex min-h-screen flex-col'>
              <Header />
              {children}
              <Footer />
            </div>

            <Toaster />
          </ThemeProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
