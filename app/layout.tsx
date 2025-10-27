import { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { APP_CONFIG_DEFAULTS } from '@/app-config';
import { ApplyThemeScript } from '@/components/theme-toggle';
import { getAppConfig } from '@/lib/utils';
import './globals.css';
import { Providers } from './providers';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const commitMono = localFont({
  src: [
    {
      path: './fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/CommitMono-700-Regular.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/CommitMono-400-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/CommitMono-700-Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-commit-mono',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'InnoIgniterAI - AI-Powered Cybersecurity',
  description: 'Empowering Everyone to Stay Secure — Smarter, Faster, and in Real Time',
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const hdrs = await headers();
  const { accent, accentDark, pageTitle, pageDescription } = await getAppConfig(hdrs);

  // check provided accent colors against defaults, and apply styles if they differ (or in development mode)
  // generate a hover color for the accent color by mixing it with 20% black
  const styles = [
    process.env.NODE_ENV === 'development' || accent !== APP_CONFIG_DEFAULTS.accent
      ? `:root { --primary: ${accent}; --primary-hover: color-mix(in srgb, ${accent} 80%, #000); }`
      : '',
    process.env.NODE_ENV === 'development' || accentDark !== APP_CONFIG_DEFAULTS.accentDark
      ? `.dark { --primary: ${accentDark}; --primary-hover: color-mix(in srgb, ${accentDark} 80%, #000); }`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {styles && <style>{styles}</style>}
        <meta name="description" content={pageDescription} />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo_dark.png" />
        <ApplyThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className={`${publicSans.variable} ${commitMono.variable} overflow-x-hidden antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
