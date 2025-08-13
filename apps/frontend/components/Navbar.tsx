'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Teams', href: '/dashboard/teams' },
    { name: 'Players', href: '/dashboard/players' },
    { name: 'Leagues', href: '/dashboard/leagues' },
    { name: 'Matches', href: '/dashboard/matches' },
    { name: 'Match Events', href: '/dashboard/match-events' },
    { name: 'Player Match Stats', href: '/dashboard/player-match-stats' },
    { name: 'Player Season Stats', href: '/dashboard/player-season-stats' },
    { name: 'Transfers', href: '/dashboard/transfers' },
    { name: 'Trophies', href: '/dashboard/trophies' },
    { name: 'Player Trophies', href: '/dashboard/player-trophies' },
    { name: 'Odds', href: '/dashboard/odds' },
  ];

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* Brand/Logo */}
        <Link href="/dashboard" className="text-white text-2xl font-bold tracking-wide">
          Focipedia
        </Link>

        {/* Mobile menu button */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } w-full flex-grow lg:flex lg:items-center lg:w-auto`}
        >
          <ul className="text-lg lg:flex-grow lg:flex lg:justify-end">
            {navItems.map((item) => (
              <li key={item.name} className="lg:ml-6 mt-4 lg:mt-0">
                <Link
                  href={item.href}
                  className={`block py-2 px-4 rounded transition duration-300 ease-in-out ${
                    pathname === item.href
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
