import type { DashboardStats, InquiryListResponse, Job, JobCreatePayload, RoleRecord, UserRecord } from '../types';

const API_BASE_URL = 'https://horizon-staffing.onrender.com/api/v1';

const readStoredValue = (key: string) => {
  try {
    return localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
};

const getStoredToken = () => readStoredValue('horigine_admin_token');

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('horigine_admin_token', token);
    return;
  }

  localStorage.removeItem('horigine_admin_token');
};

export const setStoredApiKey = (apiKey: string | null) => {
  if (apiKey) {
    localStorage.setItem('horigine_admin_api_key', apiKey.trim());
    return;
  }

  localStorage.removeItem('horigine_admin_api_key');
};

const buildHeaders = (headers?: Record<string, string>, includeAuth = true) => {
  const merged: Record<string, string> = {
    Accept: 'application/json',
    ...(headers ?? {}),
  };

  const token = getStoredToken();
  if (includeAuth && token) {
    merged.Authorization = `Bearer ${token}`;
  }

  return merged;
};

const unwrapApiPayload = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;

    if ('items' in record && Array.isArray(record.items)) {
      return payload as T;
    }

    if ('data' in record && (record.data !== undefined || Object.prototype.hasOwnProperty.call(record, 'data'))) {
      return record.data as T;
    }

    if ('success' in record && 'access_token' in record && !('token' in record)) {
      return payload as T;
    }
  }

  return payload as T;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = true,
): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const sanitizedOptions: RequestInit = { ...options, headers: buildHeaders(options.headers as Record<string, string> | undefined, includeAuth) };

  if (method === 'GET' && 'body' in sanitizedOptions) {
    delete sanitizedOptions.body;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, sanitizedOptions);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      const nestedMessage = errorData?.error?.message ?? errorData?.message ?? errorData?.detail ?? errorData?.error;
      message = nestedMessage || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json();
  return unwrapApiPayload<T>(payload);
}

const buildQueryString = (params?: Record<string, string | number | null | undefined>) => {
  const search = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
};

export const api = {
  getJobs: (): Promise<Job[]> => apiRequest('/jobs'),
  createJob: (payload: Partial<JobCreatePayload>): Promise<Job> => apiRequest('/jobs/', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }),
  updateJob: (jobId: number | string, payload: Partial<JobCreatePayload>): Promise<Job> => apiRequest(`/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }),
  deleteJob: (jobId: number | string): Promise<void> => apiRequest(`/jobs/${jobId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }),
  getInquiries: (params?: { page?: number; page_size?: number; service_interest?: string | null; status?: string | null }): Promise<InquiryListResponse> => {
    const query = new URLSearchParams({
      page: String(params?.page ?? 1),
      page_size: String(params?.page_size ?? 20),
    });

    if (params?.service_interest) {
      query.set('service_interest', params.service_interest);
    }

    if (params?.status) {
      query.set('status', params.status);
    }

    return apiRequest<InquiryListResponse>(`/inquiries?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, true);
  },
  getUsers: (): Promise<UserRecord[]> => apiRequest('/users'),
  createUser: (payload: Partial<UserRecord>): Promise<UserRecord> => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }),
  getRoles: (): Promise<RoleRecord[]> => apiRequest('/roles'),
  createRole: (payload: Partial<RoleRecord>): Promise<RoleRecord> => apiRequest('/roles', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }),
  getDashboardStats: (): Promise<DashboardStats> => apiRequest('/dashboard/admin'),
};

export const normalizeApiError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
