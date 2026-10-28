'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { ContentItem, ContentStatus, Platform } from '../../lib/types';
import { PlatformBadge } from '../../components/PlatformBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { ContentDetailModal } from '../../components/ContentDetailModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useToast } from '../../components/ToastProvider';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Calendar,
  CheckCircle,
  FileEdit,
  Eye,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';

function ContentLibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const urlSearch = searchParams.get('search') || '';

  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [search, setSearch] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

  const fetchContents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getContents({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        platform: platformFilter !== 'ALL' ? platformFilter : undefined,
        sortBy,
        sortDir,
      });
      setContents(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load content';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, platformFilter, sortBy, sortDir]);

  // Handle debounced or submitted search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContents();
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    try {
      await api.deleteContent(contentToDelete);
      toast.success('Content item removed successfully.');
      setContentToDelete(null);
      fetchContents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete';
      toast.error(msg);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await api.duplicateContent(id);
      toast.success('Content duplicated as a new draft!');
      fetchContents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to duplicate';
      toast.error(msg);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.updateStatus(id, newStatus);
      toast.success(`Content moved to ${newStatus}`);
      fetchContents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change status';
      toast.error(msg);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPlatformFilter('ALL');
    setSortBy('createdAt');
    setSortDir('desc');
  };

  const hasActiveFilters =
    search.trim() !== '' || statusFilter !== 'ALL' || platformFilter !== 'ALL';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Content Library</h1>
          <p className="text-xs text-secondary mt-1">
            Browse, search, edit, and organize all drafts and scheduled publications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchContents}
            disabled={isLoading}
            className="p-2 text-secondary hover:text-foreground bg-surface border border-border rounded-lg hover:bg-surface-subtle transition-colors shadow-xs"
            title="Reload content"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-surface-subtle border border-border rounded-lg text-secondary">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-surface text-foreground shadow-xs' : 'hover:text-foreground'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-surface text-foreground shadow-xs' : 'hover:text-foreground'
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/content/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-surface p-4 rounded-xl border border-border shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, body content, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={fetchContents}
            className="w-full pl-9 pr-8 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTimeout(fetchContents, 50);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Drafts Only</option>
            <option value="SCHEDULED">Scheduled Only</option>
            <option value="PUBLISHED">Published Only</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Platforms</option>
            <option value="TWITTER_X">X (Twitter)</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="BLOG">Blog</option>
            <option value="GENERAL">General</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split('-');
              setSortBy(sb);
              setSortDir(sd as 'asc' | 'desc');
            }}
            className="px-3 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="createdAt-desc">Newest Created</option>
            <option value="createdAt-asc">Oldest Created</option>
            <option value="scheduledAt-asc">Scheduled Date (Soonest)</option>
            <option value="scheduledAt-desc">Scheduled Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline font-medium px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Backend connection warning */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-primary/20 text-xs text-primary flex items-center justify-between">
          <span>Failed to load contents from backend: {error}</span>
          <button onClick={fetchContents} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Content Records Display */}
      {isLoading ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-secondary font-medium">Loading content library from Java backend...</p>
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center mx-auto text-secondary">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">No content items found</h3>
            <p className="text-xs text-secondary mt-1">
              {hasActiveFilters
                ? 'Try adjusting or clearing your filters to see more results.'
                : 'Your content library is currently empty. Create your first post to get started!'}
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-medium text-secondary bg-surface-subtle border border-border rounded-lg hover:bg-surface-hover transition-colors"
            >
              Clear all filters
            </button>
          ) : (
            <Link
              href="/content/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create first post
            </Link>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-secondary font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Title & Excerpt</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contents.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-subtle/50 transition-colors group"
                  >
                    {/* Title & Preview */}
                    <td
                      onClick={() => {
                        setSelectedContent(item);
                        setIsDetailOpen(true);
                      }}
                      className="py-3.5 px-4 cursor-pointer max-w-sm"
                    >
                      <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </div>
                      <div className="text-secondary truncate text-[11px] mt-0.5 max-w-md">
                        {item.body}
                      </div>
                      {item.tags && (
                        <div className="flex gap-1 mt-1">
                          {item.tags.split(',').slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] text-muted bg-surface-subtle px-1.5 py-0.2 rounded border border-border/40"
                            >
                              #{t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4">
                      <PlatformBadge platform={item.platform} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Scheduled Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.scheduledAt ? (
                        <div>
                          <div className="font-medium text-foreground">
                            {formatDate(item.scheduledAt)}
                          </div>
                          <div className="text-[10px] text-primary font-medium">
                            {formatRelativeTime(item.scheduledAt)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted text-[11px]">—</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-secondary text-[11px]">
                      {item.author || 'Editor'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedContent(item);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-surface-subtle transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/content/edit/${item.id}`}
                          className="p-1.5 text-secondary hover:text-primary rounded-md hover:bg-rose-50 transition-colors"
                          title="Edit Post"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(item.id)}
                          className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-surface-subtle transition-colors"
                          title="Duplicate as Draft"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setContentToDelete(item.id)}
                          className="p-1.5 text-secondary hover:text-primary rounded-md hover:bg-rose-50 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contents.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-xl border border-border shadow-card p-5 flex flex-col justify-between hover:border-border-dark transition-all group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <PlatformBadge platform={item.platform} />
                  <StatusBadge status={item.status} />
                </div>

                <div
                  onClick={() => {
                    setSelectedContent(item);
                    setIsDetailOpen(true);
                  }}
                  className="mt-3 cursor-pointer"
                >
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-secondary line-clamp-3 leading-relaxed">
                    {item.body}
                  </p>
                </div>

                {item.tags && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.split(',').map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-muted bg-surface-subtle px-2 py-0.5 rounded border border-border font-medium"
                      >
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-secondary">
                  {item.scheduledAt ? (
                    <span className="text-primary font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeTime(item.scheduledAt)}
                    </span>
                  ) : (
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  )}
                </span>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/content/edit/${item.id}`}
                    className="p-1.5 text-secondary hover:text-primary rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(item.id)}
                    className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-surface-subtle transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setContentToDelete(item.id)}
                    className="p-1.5 text-secondary hover:text-primary rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Details Modal */}
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

export default function ContentLibraryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-surface rounded-xl border border-border p-12 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-secondary font-medium">Loading Content Library...</p>
        </div>
      }
    >
      <ContentLibraryContent />
    </React.Suspense>
  );
}

