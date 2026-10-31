export type UserRole = 'admin' | 'manager' | 'staff' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  name?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface JobCreatePayload {
  title: string;
  company_id: number;
  description: string;
  recruiter_id?: number;
  requirements?: string;
  location?: string | null;
  job_type?: string | null;
  experience_level?: string | null;
  is_active?: boolean;
  salary_min?: number;
  salary_max?: number;
}

export interface Job {
  id: string | number;
  title: string;
  company_id?: number;
  recruiter_id?: number;
  description?: string;
  location?: string | null;
  job_type?: string | null;
  experience_level?: string | null;
  is_active?: boolean;
  created_at?: string;
  department?: string;
  status?: 'Published' | 'Draft' | 'Closed';
  location_name?: string;
  employment_type?: string;
  work_mode?: string;
  experience?: string;
  salary_range?: string;
  applicants_count?: number;
  posted_at?: string;
  skills?: string;
  education?: string;
  vacancies?: number;
  deadline?: string;
  salary_min?: number;
  salary_max?: number;
}

export interface Inquiry {
  id: string;
  full_name: string;
  work_email?: string;
  email?: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  message: string;
  status?: 'new' | 'contacted' | 'closed' | string;
  created_at?: string;
  submitted_at?: string;
}

export interface InquiryListResponse {
  items: Inquiry[];
  page: number;
  page_size: number;
  total: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  created_at?: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  created_at?: string;
}

export interface DashboardStats {
  jobs_count: number;
  published_jobs: number;
  inquiry_count: number;
  users_count: number;
  active_roles: number;
}
