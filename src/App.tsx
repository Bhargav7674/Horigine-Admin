import { useEffect, useMemo, useState } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { InquiryListPage } from './components/inquiries/InquiryListPage';
import { JobListPage } from './components/jobs/JobListPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { UserRolePage } from './components/users/UserRolePage';
import { api, normalizeApiError } from './services/api';
import { authService, getCurrentSession, persistSession } from './services/authService';
import type { Inquiry, Job, JobCreatePayload, RoleRecord, UserRecord } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(getCurrentSession()));
  const [activePage, setActivePage] = useState('Overview');
  const [jobFormOpenRequested, setJobFormOpenRequested] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const routeMap: Record<string, string> = {
    Overview: '/home',
    'Job postings': '/jobs',
    Inquiries: '/inquiries',
    'Users & Roles': '/users',
  };

  const getRouteFromPage = (page: string) => routeMap[page] ?? '/home';

  const totalApplicants = useMemo(
    () => jobs.reduce((sum, job) => sum + (job.applicants_count ?? 0), 0),
    [jobs],
  );

  const loadData = async () => {
    try {
      const [jobsData, inquiriesPage, usersData, rolesData] = await Promise.all([
        api.getJobs().catch(() => []),
        api.getInquiries({ page: 1, page_size: 20 }).catch(() => ({ items: [] as Inquiry[], page: 1, page_size: 20, total: 0 })),
        api.getUsers().catch(() => []),
        api.getRoles().catch(() => []),
      ]);

      setJobs(jobsData);
      setInquiries(inquiriesPage.items ?? []);
      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      setError('Unable to load dashboard data right now.');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadData();
  }, [isAuthenticated]);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const loginResponse = await authService.login({ email, password });

      const meUser = await authService.getMe();
      persistSession({
        token: loginResponse.token,
        user: meUser,
      });

      setIsAuthenticated(true);
      setActivePage('Overview');
      window.history.pushState({}, '', '/home');
      await loadData();
    } catch (loginError) {
      persistSession(null);
      setError(normalizeApiError(loginError));
      setIsAuthenticated(false);
      if (window.location.pathname !== '/login') {
        window.history.replaceState({}, '', '/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // no-op: session clears even if the backend logout call fails
    }

    persistSession(null);
    setIsAuthenticated(false);
    setError('');
    setActivePage('Overview');
    window.history.replaceState({}, '', '/login');
  };

  const handleCreateJob = async (payload: Partial<JobCreatePayload>) => {
    const jobPayload: JobCreatePayload = {
      title: String(payload.title ?? '').trim(),
      company_id: Number(payload.company_id ?? 1),
      description: String(payload.description ?? '').trim(),
      requirements: payload.requirements ? String(payload.requirements) : undefined,
      location: payload.location ? String(payload.location) : undefined,
      job_type: payload.job_type ? String(payload.job_type) : undefined,
      experience_level: payload.experience_level ? String(payload.experience_level) : undefined,
      salary_min: payload.salary_min !== undefined ? Number(payload.salary_min) : undefined,
      salary_max: payload.salary_max !== undefined ? Number(payload.salary_max) : undefined,
    };

    if (!jobPayload.title || !jobPayload.company_id || !jobPayload.description) {
      setError('Please fill in the job title, company, and description fields.');
      return;
    }

    try {
      const created = await api.createJob(jobPayload);
      setJobs((current) => [created, ...current]);
      setError('');
    } catch (jobError) {
      setError(normalizeApiError(jobError));
    }
  };

  const handleUpdateJob = async (jobId: number | string, payload: Partial<JobCreatePayload>) => {
    const jobPayload: JobCreatePayload = {
      title: String(payload.title ?? '').trim(),
      company_id: Number(payload.company_id ?? 1),
      description: String(payload.description ?? '').trim(),
      requirements: payload.requirements ? String(payload.requirements) : undefined,
      location: payload.location ? String(payload.location) : undefined,
      job_type: payload.job_type ? String(payload.job_type) : undefined,
      experience_level: payload.experience_level ? String(payload.experience_level) : undefined,
      salary_min: payload.salary_min !== undefined ? Number(payload.salary_min) : undefined,
      salary_max: payload.salary_max !== undefined ? Number(payload.salary_max) : undefined,
    };

    if (!jobPayload.title || !jobPayload.company_id || !jobPayload.description) {
      setError('Please fill in the job title, company, and description fields.');
      return;
    }

    try {
      const updated = await api.updateJob(jobId, jobPayload);
      setJobs((current) => current.map((job) => String(job.id) === String(jobId) ? { ...job, ...updated } : job));
      setError('');
    } catch (jobError) {
      setError(normalizeApiError(jobError));
    }
  };

  const handleDeleteJob = async (jobId: number | string) => {
    try {
      await api.deleteJob(jobId);
      setJobs((current) => current.filter((job) => String(job.id) !== String(jobId)));
      setError('');
    } catch (jobError) {
      setError(normalizeApiError(jobError));
    }
  };

  const handleCreateUser = async (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    try {
      const created = await api.bootstrapCreateUser(payload);
      setUsers((current) => [created, ...current]);
      setError('');
    } catch (userError) {
      setError(normalizeApiError(userError));
    }
  };

  const navigate = (page: string) => {
    setActivePage(page);
    if (page !== 'Job postings') {
      setJobFormOpenRequested(false);
    }
    setMobileNavOpen(false);
    const nextRoute = getRouteFromPage(page);
    if (nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }
  };

  const handleQuickCreateJob = () => {
    setActivePage('Job postings');
    setJobFormOpenRequested(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Overview':
        return <DashboardPage jobs={jobs} inquiries={inquiries} users={users} onNavigate={navigate} />;
      case 'Job postings':
        return (
          <JobListPage
            jobs={jobs}
            onCreateJob={handleCreateJob}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onRefresh={loadData}
            initialCreateOpen={jobFormOpenRequested}
            onCreateFormOpened={() => setJobFormOpenRequested(false)}
          />
        );
      case 'Inquiries':
        return <InquiryListPage inquiries={inquiries} />;
      case 'Users & Roles':
        return <UserRolePage users={users} roles={roles} onCreateUser={handleCreateUser} />;
      default:
        return <DashboardPage jobs={jobs} inquiries={inquiries} users={users} onNavigate={navigate} />;
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (!isAuthenticated) {
      if (currentPath !== '/login') {
        window.history.replaceState({}, '', '/login');
      }
      setActivePage('Overview');
      return;
    }

    if (currentPath === '/' || currentPath === '/login') {
      window.history.replaceState({}, '', '/home');
      setActivePage('Overview');
      return;
    }

    const matchingPage = Object.entries(routeMap).find(([, path]) => path === currentPath)?.[0];
    if (matchingPage) {
      setActivePage(matchingPage);
      return;
    }

    window.history.replaceState({}, '', '/home');
    setActivePage('Overview');
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const desiredPath = getRouteFromPage(activePage);
    if (window.location.pathname !== desiredPath) {
      window.history.pushState({}, '', desiredPath);
    }
  }, [activePage, isAuthenticated]);

  const session = getCurrentSession();
  const currentUser = session?.user;
  const currentUserName = currentUser?.first_name && currentUser?.last_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : currentUser?.first_name || currentUser?.name || currentUser?.email || 'Admin';

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} loading={loading} error={error} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        onCreateJob={handleQuickCreateJob}
        onLogout={handleLogout}
        totalApplicants={totalApplicants}
        userName={currentUserName}
      />

      <main className="main-area">
        <Header
          title={activePage}
          onMenuToggle={() => setMobileNavOpen((state) => !state)}
          onNotify={() => setError('You are all caught up!')}
          mobileNavOpen={mobileNavOpen}
        />

        <div className="page-content">
          {error && <div className="page-alert">{error}</div>}
          {renderPage()}
        </div>
      </main>

      {mobileNavOpen && <div className="nav-backdrop" onClick={() => setMobileNavOpen(false)} />}
    </div>
  );
}
