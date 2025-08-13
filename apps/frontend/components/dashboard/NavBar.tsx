'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  async function logout() {
    await fetch('/api/auth/logout', { method: 'DELETE' }).catch(() => {});
    router.replace('/');
  }
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link className="text-white/80 hover:text-white transition-colors" href="/dashboard">
        Áttekintés
      </Link>
      <Link className="text-white/80 hover:text-white transition-colors" href="/dashboard/matches">
        Meccsek
      </Link>
      <Link className="text-white/80 hover:text-white transition-colors" href="/dashboard/players">
        Játékosok
      </Link>
      <Link className="text-white/80 hover:text-white transition-colors" href="/dashboard/settings">
        Beállítások
      </Link>
      <Link className="text-white/80 hover:text-white transition-colors" href="/dashboard/studio">
        Adatstúdió
      </Link>
      <div className="ml-4 h-8 w-px bg-gray-300/60 dark:bg-gray-700" />
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600" aria-hidden />
          <span className="text-white hidden sm:block">Te</span>
          <span className="text-white/70">▾</span>
        </button>
        {open && (
          <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
            <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">Bejelentkezve</div>
            <div className="h-px bg-gray-200 dark:bg-gray-800" />
            <Link role="menuitem" href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Profil</Link>
            <Link role="menuitem" href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Beállítások</Link>
            <button role="menuitem" onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Kijelentkezés</button>
          </div>
        )}
      </div>
    </nav>
  );
}


