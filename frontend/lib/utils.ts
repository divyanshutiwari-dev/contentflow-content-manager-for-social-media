import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Not scheduled';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const isPast = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    const minutes = Math.floor(absDiffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return isPast ? `${days}d ago` : `in ${days}d`;
    }
    if (hours > 0) {
      return isPast ? `${hours}h ago` : `in ${hours}h`;
    }
    if (minutes > 0) {
      return isPast ? `${minutes}m ago` : `in ${minutes}m`;
    }
    return isPast ? 'just now' : 'in moments';
  } catch {
    return '';
  }
}

export const PLATFORM_LIMITS: Record<string, { max: number; label: string }> = {
  TWITTER_X: { max: 280, label: 'X (280 chars)' },
  LINKEDIN: { max: 3000, label: 'LinkedIn (3,000 chars)' },
  INSTAGRAM: { max: 2200, label: 'Instagram (2,200 chars)' },
  FACEBOOK: { max: 5000, label: 'Facebook (5,000 chars)' },
  BLOG: { max: 25000, label: 'Blog Article (Unlimited)' },
  GENERAL: { max: 10000, label: 'General (10,000 chars)' },
};
