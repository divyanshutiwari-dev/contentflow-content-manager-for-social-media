'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { DashboardStats, ContentItem } from '../../lib/types';
import { PlatformBadge } from '../../components/PlatformBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { ContentDetailModal } from '../../components/ContentDetailModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useToast } from '../../components/ToastProvider';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import {
  FileText,
  Clock,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected item for modal
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async () => {
    if (!contentToDelete) return;
    try {
      await api.deleteContent(contentToDelete);
      toast.success('Content item deleted successfully.');
      setContentToDelete(null);
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete';
      toast.error(msg);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await api.duplicateContent(id);
      toast.success('Content item duplicated as draft!');
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to duplicate';
      toast.error(msg);
    }
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Greeting & Quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
            <span>{todayStr}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            {greeting}, Creator 👋
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Here is your live multi-platform publishing and editorial pipeline overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2 text-secondary hover:text-foreground bg-surface border border-border rounded-lg hover:bg-surface-subtle transition-colors shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/content/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Backend connection failure banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-primary/20 flex items-center justify-between text-xs text-primary">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Backend connection error:</strong> {error}. Please verify your backend server status.
            </span>
          </div>
          <button
            onClick={fetchStats}
            className="px-3 py-1 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards Grid (Values loaded from real database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Content */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card flex flex-col justify-between hover:border-border-dark transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Total Content
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {isLoading ? '...' : stats?.totalContent ?? 0}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-secondary">
              <span>Database records across all platforms</span>
            </div>
          </div>
        </div>

        {/* Scheduled Content */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card flex flex-col justify-between hover:border-border-dark transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Scheduled
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-primary flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-primary">
              {isLoading ? '...' : stats?.scheduledCount ?? 0}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-primary/80 font-medium">
              <span>Active in upcoming calendar</span>
            </div>
          </div>
        </div>

        {/* Drafts Count */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card flex flex-col justify-between hover:border-border-dark transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              In Drafts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {isLoading ? '...' : stats?.draftsCount ?? 0}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-secondary">
              <span>Unscheduled idea drafts</span>
            </div>
          </div>
        </div>

        {/* Published Count */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card flex flex-col justify-between hover:border-border-dark transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-success uppercase tracking-wider">
              Published
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-success flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-success">
              {isLoading ? '...' : stats?.publishedCount ?? 0}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-success/80 font-medium">
              <span>Completed broadcasts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Weekly Publishing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Activity Overview */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Weekly Publishing Activity
              </h3>
              <p className="text-xs text-secondary">
                Scheduled vs Published volume for the current 7-day period
              </p>
            </div>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
            >
              Open Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Dynamic Activity Visualizer */}
          <div className="mt-6">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pb-2 border-b border-border">
              {stats?.weeklyOverview && stats.weeklyOverview.length > 0 ? (
                stats.weeklyOverview.map((item, idx) => {
                  const maxCount = Math.max(
                    ...stats.weeklyOverview.map((w) => w.total),
                    4
                  );
                  const scheduledHeight = (item.scheduled / maxCount) * 100;
                  const publishedHeight = (item.published / maxCount) * 100;
                  const draftsHeight = (item.drafts / maxCount) * 100;

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                        {item.total}
                      </div>
                      <div className="w-full max-w-[32px] bg-surface-subtle rounded-t-md overflow-hidden flex flex-col-reverse h-32 p-0.5 gap-0.5 border border-border/50">
                        {item.scheduled > 0 && (
                          <div
                            style={{ height: `${Math.max(scheduledHeight, 15)}%` }}
                            className="w-full bg-primary rounded-sm transition-all"
                            title={`Scheduled: ${item.scheduled}`}
                          />
                        )}
                        {item.published > 0 && (
                          <div
                            style={{ height: `${Math.max(publishedHeight, 15)}%` }}
                            className="w-full bg-success rounded-sm transition-all"
                            title={`Published: ${item.published}`}
                          />
                        )}
                        {item.drafts > 0 && (
                          <div
                            style={{ height: `${Math.max(draftsHeight, 15)}%` }}
                            className="w-full bg-neutral-300 rounded-sm transition-all"
                            title={`Drafts: ${item.drafts}`}
                          />
                        )}
                        {item.total === 0 && (
                          <div className="w-full h-1 bg-neutral-200 rounded-sm mt-auto" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-secondary mt-2">
                        {item.day}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-7 flex items-center justify-center text-xs text-secondary h-full">
                  No activity data available
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-primary" />
                Scheduled
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-success" />
                Published
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-neutral-300" />
                Drafts
              </span>
            </div>
          </div>
        </div>

        {/* Platform Distribution Card */}
        <div className="lg:col-span-4 bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Platform Breakdown
              </h3>
              <p className="text-xs text-secondary">Distribution of content by network</p>
            </div>

            <div className="mt-5 space-y-3">
              {stats?.platformDistribution &&
                Object.entries(stats.platformDistribution).map(([platformKey, count]) => {
                  const total = stats.totalContent || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={platformKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {platformKey.replace('_', ' ')}
                        </span>
                        <span className="text-secondary font-mono">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-subtle rounded-full overflow-hidden border border-border/40">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full transition-all ${
                            platformKey === 'TWITTER_X'
                              ? 'bg-neutral-800'
                              : platformKey === 'LINKEDIN'
                              ? 'bg-[#0077B5]'
                              : platformKey === 'INSTAGRAM'
                              ? 'bg-pink-500'
                              : platformKey === 'FACEBOOK'
                              ? 'bg-[#1877F2]'
                              : platformKey === 'BLOG'
                              ? 'bg-emerald-600'
                              : 'bg-neutral-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Link
              href="/content"
              className="w-full py-2 px-3 text-xs font-medium text-secondary hover:text-foreground bg-surface-subtle hover:bg-surface-hover rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View in Content Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Lists: Upcoming Posts & Recently Updated */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upcoming Content List */}
        <div className="lg:col-span-7 bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Upcoming Scheduled Content
              </h3>
              <p className="text-xs text-secondary">Next posts queued to be published</p>
            </div>
            <Link
              href="/calendar"
              className="text-xs text-secondary hover:text-foreground font-medium"
            >
              See all
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border">
            {stats?.upcomingPosts && stats.upcomingPosts.length > 0 ? (
              stats.upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedContent(post);
                    setIsDetailOpen(true);
                  }}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-surface-subtle/50 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PlatformBadge platform={post.platform} size="sm" />
                      <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.scheduledAt)}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-secondary truncate mt-0.5">{post.body}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-medium text-secondary">
                      {formatRelativeTime(post.scheduledAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Clock className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-xs text-secondary font-medium">No upcoming scheduled posts</p>
                <Link
                  href="/content/new"
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule one now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recently Updated Activity Feed */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                Recent Activity
              </h3>
              <p className="text-xs text-secondary">Latest modified drafts & posts</p>
            </div>
            <Link
              href="/content"
              className="text-xs text-secondary hover:text-foreground font-medium"
            >
              View library
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border">
            {stats?.recentlyUpdated && stats.recentlyUpdated.length > 0 ? (
              stats.recentlyUpdated.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedContent(item);
                    setIsDetailOpen(true);
                  }}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-surface-subtle/50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-[10px] text-muted font-mono">
                        {formatRelativeTime(item.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                  </div>
                  <PlatformBadge platform={item.platform} showIconOnly />
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-secondary">
                No recent activity recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onDelete={(id) => setContentToDelete(id)}
        onDuplicate={handleDuplicate}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={contentToDelete !== null}
        title="Delete Content Item"
        message="Are you sure you want to delete this content item? This action will permanently remove it from the database."
        confirmLabel="Delete Post"
        onConfirm={handleDelete}
        onCancel={() => setContentToDelete(null)}
      />
    </div>
  );
}
