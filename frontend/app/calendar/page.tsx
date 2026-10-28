'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { ContentItem } from '../../lib/types';
import { PlatformBadge } from '../../components/PlatformBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { ContentDetailModal } from '../../components/ContentDetailModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useToast } from '../../components/ToastProvider';
import { formatDate, formatTime, formatRelativeTime } from '../../lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const router = useRouter();
  const toast = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const fetchMonthEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Month is 1-indexed for backend API
      const data = await api.getCalendarEvents(year, month + 1);
      setEvents(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load calendar events';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    try {
      await api.deleteContent(contentToDelete);
      toast.success('Scheduled content item deleted.');
      setContentToDelete(null);
      fetchMonthEvents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete';
      toast.error(msg);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await api.duplicateContent(id);
      toast.success('Content duplicated as draft!');
      fetchMonthEvents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to duplicate';
      toast.error(msg);
    }
  };

  // Build Calendar Matrix
  const calendarCells = React.useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const cells = [];

    // Preceding padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      cells.push({
        day,
        isCurrentMonth: false,
        dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      });
    }

    // Days in current month
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      cells.push({
        day,
        isCurrentMonth: true,
        dateStr: `${year}-${monthStr}-${dayStr}`,
      });
    }

    // Succeeding padding days for next month
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const remaining = totalCells - cells.length;
    for (let day = 1; day <= remaining; day++) {
      cells.push({
        day,
        isCurrentMonth: false,
        dateStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      });
    }

    return cells;
  }, [year, month]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Map events by dateStr
  const eventsByDate = React.useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    events.forEach((ev) => {
      if (ev.scheduledAt) {
        const dateKey = ev.scheduledAt.split('T')[0];
        if (!map[dateKey]) {
          map[dateKey] = [];
        }
        map[dateKey].push(ev);
      }
    });
    return map;
  }, [events]);

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Content Calendar
          </h1>
          <p className="text-xs text-secondary mt-1">
            Visualize your scheduled editorial queue and plan future content releases
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMonthEvents}
            disabled={isLoading}
            className="p-2 text-secondary hover:text-foreground bg-surface border border-border rounded-lg hover:bg-surface-subtle transition-colors shadow-xs"
            title="Refresh calendar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Month Steppers */}
          <div className="flex items-center bg-surface border border-border rounded-lg p-1 shadow-xs">
            <button
              onClick={prevMonth}
              className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-surface-subtle"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-foreground min-w-[130px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-surface-subtle"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-foreground bg-surface border border-border rounded-lg hover:bg-surface-subtle shadow-xs transition-colors"
          >
            Today
          </button>

          <Link
            href="/content/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </Link>
        </div>
      </div>

      {/* Backend connection failure */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-primary/20 text-xs text-primary flex items-center justify-between">
          <span>Failed to load calendar events: {error}</span>
          <button onClick={fetchMonthEvents} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Main Calendar Matrix & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Monthly Grid */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-border shadow-card overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-border bg-surface-subtle text-center text-[11px] font-semibold uppercase tracking-wider text-secondary py-2.5">
            {WEEKDAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border border-b border-border">
            {calendarCells.map((cell, idx) => {
              const dayEvents = eventsByDate[cell.dateStr] || [];
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  className={`min-h-[105px] p-1.5 flex flex-col justify-between transition-colors relative group ${
                    cell.isCurrentMonth
                      ? 'bg-surface hover:bg-surface-subtle/40'
                      : 'bg-surface-subtle/50 text-muted'
                  }`}
                >
                  {/* Date number & Quick Add */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday
                          ? 'bg-primary text-white font-bold shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-foreground'
                          : 'text-muted'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {/* Quick schedule button on hover */}
                    {cell.isCurrentMonth && (
                      <Link
                        href={`/content/new?date=${cell.dateStr}`}
                        className="opacity-0 group-hover:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface transition-opacity"
                        title={`Schedule post for ${cell.dateStr}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Scheduled Items in cell */}
                  <div className="mt-1 space-y-1 overflow-hidden flex-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent(ev);
                          setIsDetailOpen(true);
                        }}
                        className="p-1 rounded bg-rose-50/80 hover:bg-rose-100/80 border border-primary/20 text-[11px] cursor-pointer transition-colors truncate"
                      >
                        <div className="flex items-center gap-1 font-semibold text-primary truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="truncate">{ev.title}</span>
                        </div>
                        <div className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                          <span>{formatTime(ev.scheduledAt)}</span>
                          <span>•</span>
                          <span>{ev.platformDisplay}</span>
                        </div>
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div
                        onClick={() => {
                          setSelectedContent(dayEvents[0]);
                          setIsDetailOpen(true);
                        }}
                        className="text-[10px] text-secondary font-medium px-1 text-center hover:text-primary cursor-pointer"
                      >
                        +{dayEvents.length - 2} more posts
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming in Month */}
        <div className="lg:col-span-4 bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Scheduled in {monthName}
              </h3>
              <p className="text-xs text-secondary">{events.length} queued publications</p>
            </div>
            <Link
              href="/content/new"
              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-primary rounded-lg transition-colors"
              title="Add schedule"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {events.length > 0 ? (
              events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedContent(ev);
                    setIsDetailOpen(true);
                  }}
                  className="py-3 px-2 rounded-lg hover:bg-surface-subtle/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <PlatformBadge platform={ev.platform} size="sm" />
                    <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(ev.scheduledAt)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] text-secondary line-clamp-1 mt-0.5">{ev.body}</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-secondary space-y-2">
                <CalendarIcon className="w-8 h-8 text-muted mx-auto" />
                <p>No content scheduled for this month</p>
                <Link
                  href="/content/new"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs pt-1"
                >
                  <Plus className="w-3 h-3" /> Schedule first item
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

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
        title="Delete Scheduled Post"
        message="Are you sure you want to remove this scheduled item? It will be removed from your calendar queue."
        confirmLabel="Delete Item"
        onConfirm={handleDelete}
        onCancel={() => setContentToDelete(null)}
      />
    </div>
  );
}
