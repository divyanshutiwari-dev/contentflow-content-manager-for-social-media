'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Library,
  PenSquare,
  CalendarDays,
  Settings,
  Sparkles,
  Server,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { api } from '../lib/api';
import { ThemeToggle } from './ThemeProvider';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content Library', href: '/content', icon: Library },
  { name: 'New Post', href: '/content/new', icon: PenSquare },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendHealth = async () => {
    setIsChecking(true);
    try {
      const res = await api.checkHealth();
      if (res && res.status === 'UP') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-semibold text-base text-foreground tracking-tight block leading-none">
              Content<span className="text-primary">Flow</span>
            </span>
            <span className="text-[10px] text-secondary font-medium tracking-wide uppercase">
              Scheduler SaaS
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted uppercase">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-rose-50 text-primary font-semibold shadow-xs'
                  : 'text-secondary hover:text-foreground hover:bg-surface-subtle'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-secondary'}`} />
              <span>{item.name}</span>
              {item.name === 'New Post' && (
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary text-white">
                  +
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Action Button */}
      <div className="p-4 border-t border-border">
        <Link
          href="/content/new"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all hover:shadow"
        >
          <PenSquare className="w-4 h-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Backend Live Status Indicator */}
      <div className="p-3 border-t border-border bg-surface-subtle/60 text-xs">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-success animate-pulse'
                  : backendStatus === 'offline'
                  ? 'bg-primary'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="font-medium text-foreground">
              {backendStatus === 'online'
                ? 'Java Backend Online'
                : backendStatus === 'offline'
                ? 'Backend Offline'
                : 'Connecting...'}
            </span>
          </div>
          <button
            onClick={checkBackendHealth}
            disabled={isChecking}
            title="Refresh backend status"
            className="text-secondary hover:text-foreground p-1 rounded hover:bg-surface transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="px-2 pt-1 text-[11px] text-secondary font-mono flex items-center justify-between">
          <span>Spring Boot :8080</span>
          <span>H2 DB</span>
        </div>

        {/* Creator Attribution & Dark Mode Toggle */}
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5 text-[11px] text-secondary">
            <span>Made with <span className="text-primary font-bold">♥</span> by <strong className="text-foreground font-semibold">Divyanshu</strong></span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
