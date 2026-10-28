'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Plus, Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeProvider';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/content?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 px-6 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-secondary hover:text-foreground hover:bg-surface-subtle"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search content drafts, posts, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-subtle border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
          />
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-xs text-secondary font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Made by <strong className="text-foreground font-semibold">Divyanshu</strong></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-subtle border border-border text-xs text-secondary font-medium">
          <Calendar className="w-3.5 h-3.5 text-muted" />
          <span>{todayFormatted}</span>
        </div>

        {/* Dark Mode Toggle */}
        <ThemeToggle />

        <Link
          href="/content/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Post</span>
        </Link>
      </div>
    </header>
  );
}
