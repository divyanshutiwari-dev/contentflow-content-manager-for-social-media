'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastProvider } from './ToastProvider';
import { ThemeProvider } from './ThemeProvider';
import { X } from 'lucide-react';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="flex min-h-screen">
          {/* Desktop Fixed Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative z-10 w-72 bg-surface shadow-2xl flex flex-col h-full animate-fade-in">
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-secondary hover:text-foreground rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main Application Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
            <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
