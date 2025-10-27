import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InnoIgniterAI - AI-Powered Cybersecurity',
  description: 'Empowering Everyone to Stay Secure — Smarter, Faster, and in Real Time',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
