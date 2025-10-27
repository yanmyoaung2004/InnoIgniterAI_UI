"use client";

import { useRouter } from 'next/navigation';

interface ClientHeaderProps {
  companyName: string;
  logo: string;
  logoDark: string;
}

export default function VoiceHeader({ companyName, logo, logoDark }: ClientHeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 z-50 hidden w-full flex-row justify-between items-center p-6 md:flex">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://innoreigniters.com"
        className="scale-100 transition-transform duration-300 hover:scale-110"
      >
        <img src={logo} alt={`${companyName} Logo`} className="block w-24 h-24 dark:hidden" />
        <img src={logoDark} alt={`${companyName} Logo`} className="hidden w-24 h-24 dark:block" />
      </a>

      <p
        onClick={() => router.push('/')}
        className="text-xs px-2 py-1.5 font-semibold bg-slate-100 text-black rounded-xl text-center cursor-pointer"
      >
        BACK
      </p>
    </header>
  );
}
