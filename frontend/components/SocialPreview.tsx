'use client';

import React from 'react';
import { Platform } from '../lib/types';
import { PlatformBadge } from './PlatformBadge';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Send,
  MoreHorizontal,
  CheckCircle,
} from 'lucide-react';

interface SocialPreviewProps {
  title: string;
  body: string;
  platform: Platform;
  author?: string;
  tags?: string;
}

export function SocialPreview({
  title,
  body,
  platform,
  author = 'ContentFlow User',
  tags = '',
}: SocialPreviewProps) {
  const displayAuthor = author.trim() || 'Alex Morgan';
  const handle = displayAuthor.toLowerCase().replace(/\s+/g, '');

  if (platform === 'TWITTER_X') {
    return (
      <div className="bg-surface border border-border rounded-xl p-4 max-w-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {displayAuthor.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-sm text-foreground truncate">{displayAuthor}</span>
                <span className="text-secondary text-xs truncate">@{handle}</span>
                <span className="text-secondary text-xs">· Just now</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-secondary shrink-0" />
            </div>

            <p className="mt-2 text-sm text-foreground whitespace-pre-wrap leading-normal font-sans">
              {body || 'Your tweet text will preview right here in real-time...'}
            </p>

            {tags && (
              <div className="mt-2 text-xs text-primary font-medium flex flex-wrap gap-1">
                {tags.split(',').map((t, i) => (
                  <span key={i}>#{t.trim()}</span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-secondary text-xs">
              <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> 12
              </span>
              <span className="flex items-center gap-1 hover:text-green-500 cursor-pointer">
                <Repeat2 className="w-4 h-4" /> 4
              </span>
              <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                <Heart className="w-4 h-4" /> 89
              </span>
              <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                <Bookmark className="w-4 h-4" /> 16
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'LINKEDIN') {
    return (
      <div className="bg-surface border border-border rounded-xl p-4 max-w-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {displayAuthor.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm text-foreground">{displayAuthor}</span>
                  <span className="text-[10px] text-secondary">• 1st</span>
                </div>
                <p className="text-[11px] text-secondary truncate">
                  Head of Growth & Content Strategy
                </p>
                <p className="text-[10px] text-secondary">Just now • 🌐</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-secondary shrink-0" />
            </div>

            <p className="mt-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {body || 'Your professional LinkedIn post will preview here...'}
            </p>

            {tags && (
              <div className="mt-2 text-xs text-[#0077B5] font-medium flex flex-wrap gap-1">
                {tags.split(',').map((t, i) => (
                  <span key={i}>#{t.trim()}</span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-around text-secondary text-xs">
              <span className="flex items-center gap-1.5 hover:text-[#0077B5] cursor-pointer">
                <ThumbsUp className="w-4 h-4" /> Like
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#0077B5] cursor-pointer">
                <MessageSquare className="w-4 h-4" /> Comment
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#0077B5] cursor-pointer">
                <Repeat2 className="w-4 h-4" /> Repost
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#0077B5] cursor-pointer">
                <Send className="w-4 h-4" /> Send
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Instagram / Blog / General Preview Card
  return (
    <div className="bg-surface border border-border rounded-xl p-4 max-w-lg shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {displayAuthor.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-xs text-foreground block">{handle}</span>
            <span className="text-[10px] text-secondary">Original Post</span>
          </div>
        </div>
        <PlatformBadge platform={platform} size="sm" />
      </div>

      <div className="mt-3">
        <h4 className="font-semibold text-sm text-foreground mb-1.5">{title || 'Post Title'}</h4>
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {body || 'Content body preview...'}
        </p>

        {tags && (
          <div className="mt-3 text-xs text-primary font-medium flex flex-wrap gap-1">
            {tags.split(',').map((t, i) => (
              <span key={i}>#{t.trim()}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-secondary text-xs">
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer" />
          <MessageCircle className="w-4 h-4 hover:text-blue-500 cursor-pointer" />
          <Share2 className="w-4 h-4 hover:text-neutral-900 cursor-pointer" />
        </div>
        <Bookmark className="w-4 h-4 hover:text-neutral-900 cursor-pointer" />
      </div>
    </div>
  );
}
