'use client';

import React from 'react';
import { cn } from '../../utils/cn';

interface FooterSectionProps {
  className?: string;
}

export function FooterSection({ className }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    platform: [
      { name: 'Rólunk', href: '#' },
      { name: 'Funkciók', href: '#' },
      { name: 'Árak', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    support: [
      { name: 'Súgó központ', href: '#' },
      { name: 'Kapcsolat', href: '#' },
      { name: 'Közösségi irányelvek', href: '#' },
      { name: 'Hibabejelentés', href: '#' },
    ],
    legal: [
      { name: 'Adatvédelmi szabályzat', href: '#' },
      { name: 'Felhasználási feltételek', href: '#' },
      { name: 'Cookie szabályzat', href: '#' },
      { name: 'GDPR', href: '#' },
    ],
  };

  return (
    <footer className={cn('bg-gray-900 text-white', className)} role="contentinfo" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Focipedia</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A legnagyobb magyar futball közösség. Csatlakozz hozzánk és élvezd a futball minden pillanatát társaságban, szakértő elemzésekkel és valós idejű beszélgetésekkel.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((name) => (
                <a key={name} href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" aria-label={name}>
                  <span className="sr-only">{name}</span>
                  <div className="w-5 h-5 bg-white/80 rounded" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Támogatás</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Jogi információk</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© {currentYear} Focipedia. Minden jog fenntartva.</p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Készítve ❤️-tel Magyarországon</span>
              <div className="flex items-center space-x-2" aria-hidden="true">
                <div className="w-4 h-3 bg-red-500 rounded-sm"></div>
                <div className="w-4 h-3 bg-white rounded-sm"></div>
                <div className="w-4 h-3 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


