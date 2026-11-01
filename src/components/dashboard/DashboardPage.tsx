import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Download, FileText, Sparkles, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import type { GuestApplication, Inquiry, Job, UserRecord } from '../../types';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';

interface DashboardPageProps {
  jobs: Job[];
  inquiries: Inquiry[];
  users: UserRecord[];
  onNavigate: (page: string) => void;
}

const statusOptions = ['new', 'reviewing', 'interview', 'accepted', 'rejected'];

export function DashboardPage({ jobs, inquiries, users, onNavigate }: DashboardPageProps) {
  const [guestApplications, setGuestApplications] = useState<GuestApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [statusError, setStatusError] = useState('');

  const publishedJobs = jobs.filter((job) => job.status === 'Published').length;
  const newInquiries = inquiries.filter((inquiry) => (inquiry.status ?? 'New') === 'New').length;

  useEffect(() => {
    const loadGuestApplications = async () => {
      if (!jobs.length) {
        setGuestApplications([]);
        return;
      }

      try {
        setLoadingApplications(true);
        const batches = await Promise.all(
          jobs.slice(0, 4).map(async (job) => {
            try {
              const response = await api.getGuestApplicationsByJob(job.id);
              return (response ?? []).map((application) => ({
                ...application,
                job_title: application.job_title ?? job.title,
                status: application.status ?? 'new',
              }));
            } catch {
              return [] as GuestApplication[];
            }
          }),
        );

        setGuestApplications(batches.flat());
      } catch {
        setGuestApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };

    void loadGuestApplications();
  }, [jobs]);

  const applicationSummary = useMemo(() => {
    const total = guestApplications.length;
    const reviewed = guestApplications.filter((application) => (application.status ?? 'new').toLowerCase() !== 'new').length;
    return { total, reviewed };
  }, [guestApplications]);

  const handleDownloadResume = async (applicationId: number | string) => {
    try {
      setStatusError('');
      await api.downloadGuestResume(applicationId);
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to download resume.');
    }
  };

  const handleStatusChange = async (applicationId: number | string, status: string) => {
    try {
      setStatusError('');
      await api.updateApplicationStatus(applicationId, status);
      setGuestApplications((current) => current.map((application) => (
        String(application.id) === String(applicationId) ? { ...application, status } : application
      )));
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to update application status.');
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="page-overline">MONDAY, LET’S MAKE A GREAT MATCH</div>
          <h1>
            Good afternoon, Bhargav <span>✳</span>
          </h1>
          <p>Here’s what’s happening across your hiring pipeline today.</p>
        </div>
        <button type="button" className="primary-btn" onClick={() => onNavigate('Job postings')}>
          <BriefcaseBusiness size={18} /> Create a job
        </button>
      </div>

      <div className="welcome-banner">
        <div className="banner-copy">
          <span className="banner-tag">
            <Sparkles size={13} /> YOUR HIRING AT A GLANCE
          </span>
          <h2>
            Great teams start with
            <br />
            great people.
          </h2>
          <p>Keep your hiring moving. Review new applicants and manage staffing requests in one place.</p>
          <button type="button" onClick={() => onNavigate('Inquiries')}>
            Review inquiries <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="banner-visual">
          <div className="banner-ring ring-a" />
          <div className="banner-ring ring-b" />
          <div className="banner-person person-a">AR</div>
          <div className="banner-person person-b">RS</div>
          <div className="banner-person person-c">PN</div>
          <div className="banner-person person-d">KR</div>
          <div className="match-pill">
            <span /> Talent is waiting <b>↗</b>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Your hiring snapshot</h2>
          <p>A quick look at your recruitment activity.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<BriefcaseBusiness size={19} />} label="Active jobs" value={String(publishedJobs)} note="Open to applications" tone="blue" />
        <StatCard icon={<UsersRound size={19} />} label="Total users" value={String(users.length)} note="Across team roles" tone="purple" />
        <StatCard icon={<FileText size={19} />} label="New inquiries" value={String(newInquiries)} note="Awaiting action" tone="orange" />
        <StatCard icon={<CheckCircle2 size={19} />} label="Live roles" value={String(jobs.length)} note="In the pipeline" tone="green" />
      </div>

      <div className="dashboard-grid">
        <section className="panel jobs-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent job postings</h3>
              <p>Keep an eye on your open roles.</p>
            </div>
          </div>
          <div className="recent-jobs">
            {jobs.slice(0, 4).map((job) => (
              <div className="recent-job" key={job.id}>
                <div className="job-symbol">
                  <BriefcaseBusiness size={17} />
                </div>
                <div className="recent-job-main">
                  <b>{job.title}</b>
                  <span>
                    {job.location} · {job.employment_type}
                  </span>
                </div>
                <div className="recent-job-meta">
                  <b>{job.applicants_count ?? 0}</b>
                  <span>applicants</span>
                </div>
                <StatusBadge status={job.status ?? (job.is_active ? 'Published' : 'Draft')} />
              </div>
            ))}
          </div>
          <button type="button" className="panel-footer-btn" onClick={() => onNavigate('Job postings')}>
            See all job postings <ArrowUpRight size={15} />
          </button>
        </section>

        <section className="panel applicants-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent inquiries</h3>
              <p>Incoming requests from clients and candidates.</p>
            </div>
          </div>
          <div className="latest-list">
            {inquiries.slice(0, 4).map((inquiry) => (
              <div className="latest-applicant" key={inquiry.id}>
                <div className="avatar candidate-avatar lavender">{inquiry.full_name.slice(0, 2).toUpperCase()}</div>
                <div className="latest-person">
                  <b>{inquiry.full_name}</b>
                  <span>{inquiry.service_interest ?? 'General inquiry'}</span>
                </div>
                <div className="latest-date">{inquiry.submitted_at ?? 'Recently'}</div>
              </div>
            ))}
          </div>
          <button type="button" className="panel-footer-btn" onClick={() => onNavigate('Inquiries')}>
            Explore inquiries <ArrowUpRight size={15} />
          </button>
        </section>
      </div>

      <section className="panel table-panel guest-applications-panel" style={{ marginTop: '22px' }}>
        <div className="panel-heading">
          <div>
            <h3>Guest applications</h3>
            <p>Submissions from website applicants for each active job.</p>
          </div>
        </div>

        {statusError && <div className="page-alert" style={{ margin: '0 18px 14px' }}>{statusError}</div>}

        {loadingApplications ? (
          <div className="empty-state" style={{ padding: '20px 18px 24px' }}>Loading guest applications…</div>
        ) : guestApplications.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 18px 24px' }}>No guest applications submitted yet.</div>
        ) : (
          <div className="application-table-wrap">
            <table className="data-table application-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {guestApplications.map((application) => (
                  <tr key={String(application.id)}>
                    <td>{application.job_title ?? `Job #${application.job_id ?? '-'}`}</td>
                    <td>{application.full_name ?? application.name ?? 'Guest applicant'}</td>
                    <td>{application.email ?? '—'}</td>
                    <td>
                      <select
                        className="status-select"
                        value={(application.status ?? 'new').toLowerCase()}
                        onChange={(event) => handleStatusChange(application.id, event.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button type="button" className="download-btn" onClick={() => handleDownloadResume(application.id)}>
                        <Download size={13} /> Preview resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="panel-foot-meta">
          <span>{applicationSummary.total} total submissions</span>
          <span>{applicationSummary.reviewed} reviewed</span>
        </div>
      </section>
    </>
  );
}
