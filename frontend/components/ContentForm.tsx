'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentItem, ContentRequest, ContentStatus, ContentType, Platform } from '../lib/types';
import { api } from '../lib/api';
import { useToast } from './ToastProvider';
import { SocialPreview } from './SocialPreview';
import { PLATFORM_LIMITS } from '../lib/utils';
import {
  Calendar,
  Clock,
  Send,
  Eye,
  PenLine,
  Tag,
  User,
  AlertCircle,
  FileText,
  Share2,
} from 'lucide-react';

interface ContentFormProps {
  initialData?: ContentItem;
  isEditing?: boolean;
}

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'TWITTER_X', label: 'X (Twitter)' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'BLOG', label: 'Blog Article' },
  { value: 'GENERAL', label: 'General / Multi-platform' },
];

export function ContentForm({ initialData, isEditing = false }: ContentFormProps) {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [contentType, setContentType] = useState<ContentType>(initialData?.contentType || 'SOCIAL_POST');
  const [platform, setPlatform] = useState<Platform>(initialData?.platform || 'TWITTER_X');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'DRAFT');

  // Parse initial scheduled date and time if available
  const initialDate = initialData?.scheduledAt ? initialData.scheduledAt.split('T')[0] : '';
  const initialTime = initialData?.scheduledAt ? initialData.scheduledAt.split('T')[1]?.substring(0, 5) : '';

  const [scheduledDate, setScheduledDate] = useState(initialDate);
  const [scheduledTime, setScheduledTime] = useState(initialTime || '12:00');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [author, setAuthor] = useState(initialData?.author || 'Divyanshu');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const charLimit = PLATFORM_LIMITS[platform]?.max || 5000;
  const isOverLimit = body.length > charLimit;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Title is required.';
    }

    if (!body.trim()) {
      errors.body = 'Content body cannot be empty.';
    }

    if (status === 'SCHEDULED') {
      if (!scheduledDate) {
        errors.scheduledDate = 'Scheduled date is required for scheduled content.';
      }
      if (!scheduledTime) {
        errors.scheduledTime = 'Scheduled time is required.';
      }

      if (scheduledDate && scheduledTime) {
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        if (isNaN(scheduledDateTime.getTime())) {
          errors.scheduledDate = 'Invalid date/time format.';
        } else if (!isEditing || (initialData?.scheduledAt !== `${scheduledDate}T${scheduledTime}:00`)) {
          if (scheduledDateTime.getTime() <= Date.now()) {
            errors.scheduledDate = 'Scheduled date and time must be in the future.';
          }
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);

    try {
      let scheduledAtIso: string | null = null;
      if (status === 'SCHEDULED' && scheduledDate && scheduledTime) {
        scheduledAtIso = `${scheduledDate}T${scheduledTime}:00`;
      }

      const payload: ContentRequest = {
        title: title.trim(),
        body: body.trim(),
        contentType,
        platform,
        status,
        scheduledAt: scheduledAtIso,
        tags: tags.trim() || undefined,
        author: author.trim() || undefined,
      };

      if (isEditing && initialData) {
        await api.updateContent(initialData.id, payload);
        toast.success('Content updated successfully!');
      } else {
        await api.createContent(payload);
        toast.success(
          status === 'SCHEDULED'
            ? 'Content scheduled successfully!'
            : 'Draft saved to Content Library!'
        );
      }

      router.push('/content');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Main Editor Form */}
      <div className="lg:col-span-7 bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8">
        {/* Tab switch for mobile/tablet */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              {isEditing ? 'Edit Content' : 'Create New Content'}
            </h1>
            <p className="text-xs text-secondary mt-1">
              Draft or schedule posts across your connected platforms
            </p>
          </div>

          <div className="flex items-center p-1 bg-surface-subtle border border-border rounded-lg text-xs font-medium lg:hidden">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'edit'
                  ? 'bg-surface text-foreground shadow-xs'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-surface text-foreground shadow-xs'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
        </div>

        {activeTab === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-foreground mb-1.5">
                Post Title <span className="text-primary">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Announcing Our Summer Product Update"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm bg-surface-subtle border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:bg-surface transition-all ${
                  formErrors.title
                    ? 'border-primary focus:ring-primary'
                    : 'border-border focus:ring-primary'
                }`}
              />
              {formErrors.title && (
                <p className="mt-1.5 text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.title}
                </p>
              )}
            </div>

            {/* Platform & Content Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Target Platform <span className="text-primary">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Content Type <span className="text-primary">*</span>
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
                >
                  <option value="SOCIAL_POST">Social Media Post</option>
                  <option value="BLOG_DRAFT">Blog Draft</option>
                </select>
              </div>
            </div>

            {/* Content Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="body" className="block text-xs font-semibold text-foreground">
                  Content Body <span className="text-primary">*</span>
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    isOverLimit ? 'text-primary font-bold' : 'text-secondary'
                  }`}
                >
                  {body.length} / {charLimit} chars
                </span>
              </div>
              <textarea
                id="body"
                rows={7}
                placeholder="Write your engaging post, hashtag campaign, or article draft here..."
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (formErrors.body) setFormErrors((prev) => ({ ...prev, body: '' }));
                }}
                className={`w-full p-3.5 text-sm bg-surface-subtle border rounded-lg text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:bg-surface transition-all resize-y ${
                  formErrors.body
                    ? 'border-primary focus:ring-primary'
                    : 'border-border focus:ring-primary'
                }`}
              />
              {formErrors.body && (
                <p className="mt-1.5 text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.body}
                </p>
              )}
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Publishing Status <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['DRAFT', 'SCHEDULED', 'PUBLISHED'] as ContentStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      status === s
                        ? 'border-primary bg-rose-50 text-primary font-semibold ring-1 ring-primary'
                        : 'border-border bg-surface-subtle text-secondary hover:text-foreground hover:bg-surface-hover'
                    }`}
                  >
                    {s === 'DRAFT' && 'Save as Draft'}
                    {s === 'SCHEDULED' && 'Schedule Post'}
                    {s === 'PUBLISHED' && 'Mark Published'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduling Date & Time Pickers (Visible when SCHEDULED) */}
            {status === 'SCHEDULED' && (
              <div className="p-4 rounded-xl bg-rose-50/50 border border-primary/20 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Calendar className="w-4 h-4" />
                  <span>Choose Schedule Date & Time</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-secondary mb-1">
                      Date (Future)
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setScheduledDate(e.target.value);
                        if (formErrors.scheduledDate)
                          setFormErrors((prev) => ({ ...prev, scheduledDate: '' }));
                      }}
                      className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-secondary mb-1">
                      Time (24h)
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {formErrors.scheduledDate && (
                  <p className="text-xs text-primary flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors.scheduledDate}
                  </p>
                )}
              </div>
            )}

            {/* Author and Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Author / Creator
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Divyanshu"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="launch, growth, design"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-subtle border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-secondary hover:text-foreground hover:bg-surface-subtle border border-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>
                  {isEditing
                    ? 'Save Changes'
                    : status === 'SCHEDULED'
                    ? 'Schedule Post'
                    : 'Save Draft'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-4">
            <SocialPreview
              title={title}
              body={body}
              platform={platform}
              author={author}
              tags={tags}
            />
          </div>
        )}
      </div>

      {/* Desktop Live Social Preview Pane */}
      <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Live Social Preview
          </span>
          <span className="text-[11px] text-muted">Simulated card</span>
        </div>

        <SocialPreview
          title={title}
          body={body}
          platform={platform}
          author={author}
          tags={tags}
        />

        <div className="p-4 bg-surface rounded-xl border border-border shadow-card text-xs text-secondary space-y-2">
          <div className="font-semibold text-foreground">💡 Scheduling Tip</div>
          <p className="leading-relaxed">
            ContentFlow manages your editorial pipeline and calendar schedules. Make sure your dates
            match your peak audience engagement windows.
          </p>
        </div>
      </div>
    </div>
  );
}
