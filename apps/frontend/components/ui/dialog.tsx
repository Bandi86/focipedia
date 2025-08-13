'use client';
import React from 'react';

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-[#0b0019]/95 text-white border border-white/10 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-5 pt-4 pb-2 border-b border-white/10 font-semibold">{children}</div>;
}
export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4">{children}</div>;
}
export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-5 pt-2 pb-4 border-t border-white/10 flex items-center justify-end gap-2">{children}</div>;
}


