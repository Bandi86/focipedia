'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../../utils/cn';

interface NavigationProps {
  className?: string;
  onLogin?: () => void;
  onRegister?: () => void;
}

export function Navigation({ className, onLogin, onRegister }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ids = ['hero', 'features', 'testimonials', 'contact'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const container = mobileMenuRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = `#${sectionId}`;
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Kezdőlap', id: 'hero' },
    { name: 'Funkciók', id: 'features' },
    { name: 'Vélemények', id: 'testimonials' },
    { name: 'Kapcsolat', id: 'contact' },
  ];

  return (
    <header role="banner">
      <nav
        role="navigation"
        aria-label="Fő navigáció"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span
                className={cn(
                  'text-2xl font-bold transition-colors duration-300',
                  isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                )}
              >
                Focipedia
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'px-3 py-2 text-sm font-medium transition-colors duration-300 hover:scale-105 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md',
                        isScrolled
                          ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                          : 'text-white/90 hover:text-white',
                        isActive && (isScrolled ? 'text-blue-600 dark:text-blue-400' : 'text-white')
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                className={cn(
                  'bg-transparent hover:bg-transparent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    : 'text-white hover:text-white'
                )}
                onClick={onLogin || (() => (window.location.href = '/login'))}
              >
                Bejelentkezés
              </Button>
              <Button
                className={cn(
                  'transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                )}
                onClick={onRegister || (() => (window.location.href = '/register'))}
              >
                Regisztráció
              </Button>
            </div>
            <div className="md:hidden">
              <button
                ref={mobileToggleRef}
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className={cn(
                  'inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    : 'text-white hover:text-white hover:bg-white/10'
                )}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
              >
                <span className="sr-only">{isMobileMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'block px-3 py-2 text-base font-medium rounded-md w-full text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                    'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800',
                    isActive && 'text-blue-600 dark:text-blue-400'
                  )}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2">
                <Button
                  className="bg-transparent hover:bg-transparent justify-start text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={onLogin || (() => (window.location.href = '/login'))}
                >
                  Bejelentkezés
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={onRegister || (() => (window.location.href = '/register'))}
                >
                  Regisztráció
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="sr-only" role="status" aria-live="polite">
        {isMobileMenuOpen ? 'Menü megnyitva' : 'Menü bezárva'}
      </div>
    </header>
  );
}


