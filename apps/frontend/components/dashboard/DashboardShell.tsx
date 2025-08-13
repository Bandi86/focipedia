'use client';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { NavBar } from './NavBar';

export default function DashboardShell({ children, title }: { children?: ReactNode; title?: string }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0019] via-[#1a0033] to-[#2d004d]">
      <header className="sticky top-0 z-40 backdrop-blur bg-[#0b0019]/60 border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Logo />
          <NavBar />
        </div>
      </header>
      <main className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{title ?? `${t('common:appName')} Dashboard`}</h1>
        {children}
      </main>
    </div>
  );
}


