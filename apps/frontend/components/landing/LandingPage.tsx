'use client';

import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FooterSection } from './FooterSection';
import Hero from './Hero';
import AuthForm from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation onLogin={() => setAuthModal('login')} onRegister={() => setAuthModal('register')} />
      <main id="main-content" role="main" aria-labelledby="page-title">
        <h1 id="page-title" className="sr-only">Focipedia – Magyar futball közösség</h1>
        <section id="hero" aria-labelledby="hero-heading">
          <Hero onLogin={() => setAuthModal('login')} onRegister={() => setAuthModal('register')} />
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
      {authModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" aria-describedby="auth-modal-desc" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAuthModal(null)} />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 id="auth-modal-title" className="text-lg font-semibold">{authModal === 'login' ? 'Bejelentkezés' : 'Regisztráció'}</h2>
                <Button className="bg-transparent hover:bg-transparent text-gray-500" onClick={() => setAuthModal(null)}>Bezárás</Button>
              </div>
              <p id="auth-modal-desc" className="sr-only">{authModal === 'login' ? 'Jelentkezz be a Focipediába' : 'Hozz létre egy fiókot a Focipedián'}</p>
              <AuthForm mode={authModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


