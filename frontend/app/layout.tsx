'use client';

import React, { useState } from 'react';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { ToastProvider } from '../components/ToastProvider';
import { ThemeProvider } from '../components/ThemeProvider';
import { X } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>ContentFlow — Premium Content Scheduler</title>
        <meta
          name="description"
          content="ContentFlow is a unified, minimalist content management and scheduling dashboard for high-growth creators and marketing teams."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-rose-100 selection:text-primary">
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
      </body>
    </html>
  );
}
