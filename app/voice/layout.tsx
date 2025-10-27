import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getAppConfig } from '@/lib/utils';
import Protected from '../components/Protected';
import ClientHeader from './VoiceHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'InnoIgniterAI - AI-Powered Cybersecurity',
  description: 'Empowering Everyone to Stay Secure — Smarter, Faster, and in Real Time',
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const hdrs = await headers();
  const { companyName, logo, logoDark } = await getAppConfig(hdrs);

  return (
    <>
      <Protected>
        <ClientHeader
          companyName={companyName || 'Company'}
          logo={logo || '/logo_light.png'}
          logoDark={logoDark || '/logo_dark.png'}
        />
        {children}
      </Protected>
    </>
  );
}
