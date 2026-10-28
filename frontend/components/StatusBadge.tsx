'use client';

import React from 'react';
import { ContentStatus } from '../lib/types';
import { FileEdit, Calendar, CheckCircle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ContentStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const getStatusDetails = () => {
    switch (status) {
      case 'DRAFT':
        return {
          label: 'Draft',
          icon: FileEdit,
          classes: 'bg-neutral-100 text-neutral-700 border-neutral-200',
          dot: 'bg-neutral-400',
        };
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          icon: Calendar,
          classes: 'bg-rose-50 text-primary border-primary/20',
          dot: 'bg-primary animate-pulse',
        };
      case 'PUBLISHED':
        return {
          label: 'Published',
          icon: CheckCircle,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'ARCHIVED':
        return {
          label: 'Archived',
          icon: Archive,
          classes: 'bg-neutral-100 text-neutral-500 border-neutral-200',
          dot: 'bg-neutral-400',
        };
      default:
        return {
          label: status,
          icon: FileEdit,
          classes: 'bg-neutral-100 text-neutral-700 border-neutral-200',
          dot: 'bg-neutral-400',
        };
    }
  };

  const details = getStatusDetails();
  const Icon = details.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${details.classes} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${details.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {details.label}
    </span>
  );
}
