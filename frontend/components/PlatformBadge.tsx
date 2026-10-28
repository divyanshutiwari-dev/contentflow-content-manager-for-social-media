'use client';

import React from 'react';
import { Platform } from '../lib/types';
import { Globe, Linkedin, Instagram, Facebook, FileText, Twitter } from 'lucide-react';

interface PlatformBadgeProps {
  platform: Platform;
  showIconOnly?: boolean;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, showIconOnly = false, size = 'sm' }: PlatformBadgeProps) {
  const getPlatformDetails = () => {
    switch (platform) {
      case 'TWITTER_X':
        return {
          label: 'X (Twitter)',
          icon: Twitter,
          color: 'bg-neutral-900 text-white',
          pill: 'bg-neutral-100 text-neutral-800 border-neutral-200',
        };
      case 'LINKEDIN':
        return {
          label: 'LinkedIn',
          icon: Linkedin,
          color: 'bg-[#0077B5] text-white',
          pill: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'INSTAGRAM':
        return {
          label: 'Instagram',
          icon: Instagram,
          color: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white',
          pill: 'bg-pink-50 text-pink-700 border-pink-200',
        };
      case 'FACEBOOK':
        return {
          label: 'Facebook',
          icon: Facebook,
          color: 'bg-[#1877F2] text-white',
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'BLOG':
        return {
          label: 'Blog',
          icon: FileText,
          color: 'bg-emerald-600 text-white',
          pill: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      default:
        return {
          label: 'General',
          icon: Globe,
          color: 'bg-neutral-600 text-white',
          pill: 'bg-neutral-100 text-neutral-700 border-neutral-200',
        };
    }
  };

  const details = getPlatformDetails();
  const Icon = details.icon;

  if (showIconOnly) {
    return (
      <span
        title={details.label}
        className={`inline-flex items-center justify-center rounded-md ${details.pill} border ${
          size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
        }`}
      >
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${details.pill} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {details.label}
    </span>
  );
}
