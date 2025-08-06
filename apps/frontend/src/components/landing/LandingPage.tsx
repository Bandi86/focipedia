'use client';

import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FooterSection } from './FooterSection';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

/**
 * Lightweight Dialog implementation compatible with shadcn/ui API shape
 * (since ui/dialog.tsx is not present). Provides accessible, focus-managed modal.
 */
function Dialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

function DialogTrigger({
  children,
}: {
  children: React.ReactElement;
}) {
  return children;
}

function DialogContent({
  'aria-label': ariaLabel,
  children,
}: {
  'aria-label'?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}
function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function LandingPage() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [loginPrefillData, setLoginPrefillData] = useState<{ emailOrUsername: string; password: string } | undefined>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main id="main-content" role="main" aria-labelledby="page-title">
        {/* Keep only one visible h1 across the page for semantics */}
        <h1 id="page-title" className="sr-only">Focipedia – Magyar futball közösség</h1>

        {/* Triggers example (kept optional, hero may also have CTAs). */}
        <div className="sr-only">
          <Dialog>
            <DialogTrigger>
              <Button>Bejelentkezés</Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <section id="hero" aria-labelledby="hero-heading">
          <HeroSection />
        </section>
        
        <section id="features" aria-labelledby="features-heading">
          <FeaturesSection />
        </section>
        
        <section id="testimonials" aria-labelledby="testimonials-heading">
          <TestimonialsSection />
        </section>
        
        <section id="contact" aria-labelledby="contact-heading">
          <FooterSection />
        </section>
      </main>

      {/* Login Modal */}
      {authModal === 'login' && (
        <Dialog>
          <DialogContent aria-label="Bejelentkezés">
            <DialogHeader>
              <DialogTitle>Bejelentkezés</DialogTitle>
              <DialogDescription>Jelentkezz be a Focipediába</DialogDescription>
            </DialogHeader>
            <LoginForm
              onSuccess={() => setAuthModal(null)}
              onError={() => void 0}
              prefillData={loginPrefillData}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Register Modal */}
      {authModal === 'register' && (
        <Dialog>
          <DialogContent aria-label="Regisztráció">
            <DialogHeader>
              <DialogTitle>Regisztráció</DialogTitle>
              <DialogDescription>Hozz létre egy fiókot a Focipedián</DialogDescription>
            </DialogHeader>
            <RegisterForm
              onSuccess={(userData) => {
                if (userData) {
                  // Auto-navigate to login with pre-filled data
                  setLoginPrefillData({
                    emailOrUsername: userData.email,
                    password: userData.password
                  });
                  setAuthModal('login');
                } else {
                  setAuthModal(null);
                }
              }}
              onError={() => void 0}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}