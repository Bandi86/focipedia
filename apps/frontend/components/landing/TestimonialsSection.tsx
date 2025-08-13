'use client';

import React from 'react';
import { cn } from '../../utils/cn';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  delay?: string;
}

function TestimonialCard({ name, role, avatar, content, rating, delay = '' }: TestimonialCardProps) {
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1',
        'border border-gray-200 dark:border-gray-700',
        'animate-fade-in-up',
        delay
      )}
    >
      <div className="mb-6">
        <svg className="w-8 h-8 text-blue-500 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">&ldquo;{content}&rdquo;</p>
      <div className="flex items-center mb-6">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={cn('w-5 h-5', i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600')}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const testimonials = [
    { name: 'Kovács Péter', role: 'Fradi szurkoló', avatar: 'KP', content: 'A Focipedia teljesen megváltoztatta, ahogy a futballt követem. Fantasztikus közösség és mindig naprakész információk!', rating: 5 },
    { name: 'Nagy Anna', role: 'Újpest drukkere', avatar: 'NA', content: 'Végre egy platform, ahol kulturáltan lehet beszélgetni a futballról. Az élő kommentelés a meccsek alatt fantasztikus!', rating: 5 },
    { name: 'Szabó Gábor', role: 'Vidi szurkoló', avatar: 'SG', content: 'A statisztikák és elemzések segítségével sokkal jobban megértem a játékot. Profi szintű tartalom!', rating: 5 },
    { name: 'Tóth Eszter', role: 'Honvéd drukkere', avatar: 'TE', content: 'Imádom, hogy mobilon is tökéletesen működik. Bárhol vagyok, mindig kapcsolatban maradhatok a közösséggel.', rating: 4 },
    { name: 'Horváth Zoltán', role: 'Paks szurkoló', avatar: 'HZ', content: 'A személyre szabott tartalom miatt mindig érdekes dolgokat találok. Az algoritmus tényleg megtanulja, mi érdekel.', rating: 5 },
    { name: 'Kiss Márta', role: 'Debrecen drukkere', avatar: 'KM', content: 'A közösség tagjai segítőkészek és barátságosak. Sok új barátot szereztem itt a futball szeretete által.', rating: 5 },
  ];
  return (
    <section className={cn('py-20 bg-white dark:bg-gray-800', className)} aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
            Mit mondanak
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> felhasználóink</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Több ezer elégedett felhasználó tapasztalatai és véleményei a Focipedia platformról.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, index) => (
            <TestimonialCard key={index} {...t} delay={`animation-delay-${(index + 1) * 200}`} />
          ))}
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 md:p-12 text-white animate-fade-in-up animation-delay-1000">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-50">Elégedett felhasználó</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-50">Átlagos értékelés</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-50">Ügyfélszolgálat</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-50">Aktív felhasználó</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


