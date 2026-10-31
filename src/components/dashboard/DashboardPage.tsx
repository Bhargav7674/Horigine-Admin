import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, FileText, Sparkles, UsersRound } from 'lucide-react';
import type { Inquiry, Job, UserRecord } from '../../types';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';

interface DashboardPageProps {
  jobs: Job[];
  inquiries: Inquiry[];
  users: UserRecord[];
  onNavigate: (page: string) => void;
}

export function DashboardPage({ jobs, inquiries, users, onNavigate }: DashboardPageProps) {
  const publishedJobs = jobs.filter((job) => job.status === 'Published').length;
  const newInquiries = inquiries.filter((inquiry) => (inquiry.status ?? 'New') === 'New').length;

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
    </>
  );
}
