'use client';

import React from 'react';
import { ContentItem } from '../lib/types';
import { PlatformBadge } from './PlatformBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate, formatRelativeTime } from '../lib/utils';
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  Copy,
  Edit3,
  Trash2,
  FileText,
  Share2,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface ContentDetailModalProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

export function ContentDetailModal({
  content,
  isOpen,
  onClose,
  onDelete,
  onDuplicate,
}: ContentDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !content) return null;

  const handleCopyBody = () => {
    navigator.clipboard.writeText(content.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl border border-border shadow-popover w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-3">
            <PlatformBadge platform={content.platform} />
            <StatusBadge status={content.status} />
            <span className="text-xs text-secondary font-mono">ID #{content.id}</span>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-foreground p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {content.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {content.author || 'Content Manager'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {content.contentTypeDisplay}
              </span>
              <span>•</span>
              <span>{content.characterCount} characters</span>
            </div>
          </div>

          {/* Schedule Info Banner if scheduled */}
          {content.status === 'SCHEDULED' && content.scheduledAt && (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-primary/20 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 text-primary">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  Scheduled for {formatDate(content.scheduledAt)}
                </span>
              </div>
              <span className="text-xs text-primary/80 font-medium">
                {formatRelativeTime(content.scheduledAt)}
              </span>
            </div>
          )}

          {/* Content Body Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Content Body
              </span>
              <button
                onClick={handleCopyBody}
                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-primary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span className="text-success font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-surface-subtle rounded-xl border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans font-normal selection:bg-rose-100">
              {content.body}
            </div>
          </div>

          {/* Tags */}
          {content.tags && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {content.tags.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs bg-surface-subtle text-foreground rounded-md border border-border font-medium"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta timestamps */}
          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-xs text-secondary">
            <div>
              <span className="block text-muted">Created</span>
              <span className="font-medium text-foreground">{formatDate(content.createdAt)}</span>
            </div>
            <div>
              <span className="block text-muted">Last Updated</span>
              <span className="font-medium text-foreground">{formatDate(content.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border bg-surface-subtle/50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(content.id);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Post
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDuplicate(content.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-secondary hover:text-foreground bg-surface hover:bg-surface-subtle border border-border rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate Draft
            </button>
            <Link
              href={`/content/edit/${content.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
