'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContentForm } from '../../../../components/ContentForm';
import { api } from '../../../../lib/api';
import { ContentItem } from '../../../../lib/types';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params.id as string;
  const contentId = parseInt(idStr, 10);

  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(contentId)) {
      setError('Invalid content ID provided.');
      setIsLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const data = await api.getContent(contentId);
        setContent(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to retrieve content item';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-secondary font-medium">Loading content editor...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-primary mx-auto" />
        <div>
          <h2 className="text-base font-semibold text-foreground">Content Item Not Found</h2>
          <p className="text-xs text-secondary mt-1">{error || 'This content item does not exist or has been deleted.'}</p>
        </div>
        <Link
          href="/content"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-secondary bg-surface-subtle border border-border rounded-lg hover:bg-surface-hover"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Content Library
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ContentForm initialData={content} isEditing={true} />
    </div>
  );
}
