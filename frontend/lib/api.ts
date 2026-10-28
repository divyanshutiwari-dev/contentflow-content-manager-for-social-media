import { ApiResponse, ContentItem, ContentRequest, DashboardStats } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: `HTTP ${res.status}: Failed to parse server response.`,
      data: null as unknown as T,
      timestamp: new Date().toISOString(),
    }));

    if (!res.ok || !data.success) {
      const msg = data.message || `Request failed with HTTP status ${res.status}`;
      throw new ApiError(msg, res.status);
    }

    return data.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Unable to connect to ContentFlow backend server.';
    throw new ApiError(message, 0);
  }
}

export const api = {
  // Fetch all contents with optional search, filters, and sorting
  async getContents(params?: {
    search?: string;
    status?: string;
    platform?: string;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ContentItem[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.platform && params.platform !== 'ALL') query.append('platform', params.platform);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    const endpoint = `/contents${queryString ? `?${queryString}` : ''}`;
    return request<ContentItem[]>(endpoint);
  },

  // Get single content by ID
  async getContent(id: number): Promise<ContentItem> {
    return request<ContentItem>(`/contents/${id}`);
  },

  // Create new content
  async createContent(payload: ContentRequest): Promise<ContentItem> {
    return request<ContentItem>('/contents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Update existing content
  async updateContent(id: number, payload: ContentRequest): Promise<ContentItem> {
    return request<ContentItem>(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Delete content
  async deleteContent(id: number): Promise<void> {
    await request<void>(`/contents/${id}`, {
      method: 'DELETE',
    });
  },

  // Duplicate content
  async duplicateContent(id: number): Promise<ContentItem> {
    return request<ContentItem>(`/contents/${id}/duplicate`, {
      method: 'POST',
    });
  },

  // Update status (e.g. Move to Draft, Mark Published)
  async updateStatus(id: number, status: string): Promise<ContentItem> {
    return request<ContentItem>(`/contents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Get dashboard statistics directly from Java backend database
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/contents/stats');
  },

  // Get calendar events
  async getCalendarEvents(year?: number, month?: number): Promise<ContentItem[]> {
    const query = new URLSearchParams();
    if (year) query.append('year', year.toString());
    if (month) query.append('month', month.toString());
    const queryString = query.toString();
    const endpoint = `/contents/calendar${queryString ? `?${queryString}` : ''}`;
    return request<ContentItem[]>(endpoint);
  },

  // Health check
  async checkHealth(): Promise<{ status: string; service: string; version: string; database: string }> {
    return request<{ status: string; service: string; version: string; database: string }>('/health');
  },
};
