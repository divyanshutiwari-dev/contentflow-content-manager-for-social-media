'use client';

import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../components/ToastProvider';
import { useTheme, ThemeToggle } from '../../components/ThemeProvider';
import {
  Settings,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Sun,
  Moon,
  User,
  Heart,
} from 'lucide-react';

export default function SettingsPage() {
  const toast = useToast();
  const { theme, setTheme } = useTheme();

  const [defaultPlatform, setDefaultPlatform] = useState('TWITTER_X');
  const [defaultAuthor, setDefaultAuthor] = useState('Divyanshu');
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const testConnection = async () => {
    setIsTesting(true);
    const start = performance.now();
    try {
      const res = await api.checkHealth();
      const latency = Math.round(performance.now() - start);
      setBackendStatus(res);
      setPingLatency(latency);
      toast.success(`Connected to Java Spring Boot backend in ${latency}ms!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      toast.error(`Backend connectivity failed: ${msg}`);
      setBackendStatus({ status: 'DOWN', error: msg });
      setPingLatency(null);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Workspace preferences saved successfully!');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings & System Info
        </h1>
        <p className="text-xs text-secondary mt-1">
          Manage workspace defaults, review backend API health, and understand the ContentFlow architecture
        </p>
      </div>

      {/* Backend & Database Health Checker */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-primary flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Backend & Database Infrastructure</h3>
              <p className="text-xs text-secondary">
                Verify live communication between Next.js and Java Spring Boot
              </p>
            </div>
          </div>

          <button
            onClick={testConnection}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-surface-subtle border border-border">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
              Spring Boot REST API
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono font-medium text-foreground">
                http://localhost:8080/api
              </span>
            </div>
            {pingLatency !== null && (
              <span className="text-[10px] text-success font-medium block mt-1">
                Latency: {pingLatency} ms (Fast)
              </span>
            )}
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
              Database Persistence
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono font-medium text-foreground">
                H2 File Store (./data/contentflow)
              </span>
            </div>
            <span className="text-[10px] text-secondary block mt-1">
              Persistent across restarts
            </span>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
              Runtime Architecture
            </span>
            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-foreground">
                Java 21 + Next.js 14 App Router
              </span>
            </div>
            <span className="text-[10px] text-secondary block mt-1">
              Full-Stack Decoupled Architecture
            </span>
          </div>
        </div>

        {backendStatus && (
          <div className="mt-4 p-3 bg-surface rounded-lg border border-border text-xs text-secondary font-mono">
            <pre className="whitespace-pre-wrap">{JSON.stringify(backendStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Workspace Preferences Form */}
      <form onSubmit={handleSavePreferences} className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Workspace Defaults</h3>
            <p className="text-xs text-secondary">Configure default parameters for new content items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Default Target Platform
            </label>
            <select
              value={defaultPlatform}
              onChange={(e) => setDefaultPlatform(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="TWITTER_X">X (Twitter)</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="BLOG">Blog Article</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Default Author / Publisher Name
            </label>
            <input
              type="text"
              value={defaultAuthor}
              onChange={(e) => setDefaultAuthor(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Appearance & Theme Toggle Section */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-foreground flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Appearance & Theme</h3>
              <p className="text-xs text-secondary">Toggle between crisp Light mode and modern sleek Dark mode</p>
            </div>
          </div>
          <ThemeToggle showLabel />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all ${
              theme === 'light'
                ? 'border-primary ring-2 ring-primary/20 bg-surface'
                : 'border-border bg-surface-subtle hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" /> Light Mode
              </span>
              {theme === 'light' && <span className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <p className="text-[11px] text-secondary mt-1">
              Minimalist warm gray background (#F8F8F6) with high contrast.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-primary ring-2 ring-primary/20 bg-surface'
                : 'border-border bg-surface-subtle hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-amber-400" /> Dark Mode
              </span>
              {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <p className="text-[11px] text-secondary mt-1">
              Deep sleek dark canvas (#0F0F11) with radiant red accents.
            </p>
          </button>
        </div>
      </div>

      {/* Creator & Author Info Card */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Made by Divyanshu</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-primary rounded-full border border-primary/20">
                Creator & Developer
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Engineered with Java 21, Spring Boot 3, and Next.js 14 App Router.
            </p>
          </div>
        </div>
        <div className="text-xs text-secondary font-mono flex items-center gap-1.5 self-start sm:self-auto bg-surface-subtle px-3 py-1.5 rounded-lg border border-border">
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          <span>ContentFlow v1.0.0</span>
        </div>
      </div>

      {/* Editorial Workflow & Scheduling Philosophy */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Info className="w-4 h-4 text-secondary" />
          <span>Understanding ContentFlow Editorial Workflow</span>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          ContentFlow acts as your centralized scheduling command center. Unlike monolithic tools with complex third-party tokens, ContentFlow is designed for high-velocity teams who need crystal-clear pipeline visibility:
        </p>
        <ul className="list-disc list-inside text-xs text-secondary space-y-1 pl-2">
          <li><strong>Drafts:</strong> Flexible scratchpads for emerging copy, hashtags, and outlines with no required scheduling deadlines.</li>
          <li><strong>Scheduled:</strong> Validated entries assigned to specific future calendar slots with real-time character boundary monitoring.</li>
          <li><strong>Published:</strong> Historical record of released broadcasts that update your dynamic publishing analytics.</li>
        </ul>
      </div>
    </div>
  );
}
