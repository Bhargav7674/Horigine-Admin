import { Download, Filter, Loader2, Pencil, Plus, Search, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Job, JobCreatePayload } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface JobListPageProps {
  jobs: Job[];
  onCreateJob: (payload: Partial<JobCreatePayload>) => Promise<void> | void;
  onUpdateJob: (jobId: number | string, payload: Partial<JobCreatePayload>) => Promise<void> | void;
  onDeleteJob: (jobId: number | string) => Promise<void> | void;
  onRefresh: () => Promise<void>;
  initialCreateOpen?: boolean;
  onCreateFormOpened?: () => void;
}

const emptyJobForm = {
  title: '',
  company_id: 1,
  description: '',
  requirements: '',
  location: '',
  job_type: '',
  experience_level: '',
  salary_min: 0,
  salary_max: 0,
};

export function JobListPage({ jobs, onCreateJob, onUpdateJob, onDeleteJob, onRefresh, initialCreateOpen = false, onCreateFormOpened }: JobListPageProps) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(initialCreateOpen);
  const [editingJobId, setEditingJobId] = useState<number | string | null>(null);
  const [form, setForm] = useState(emptyJobForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialCreateOpen) {
      setShowCreateForm(true);
      setFormError('');
      setSuccessMessage('');
      onCreateFormOpened?.();
    }
  }, [initialCreateOpen, onCreateFormOpened]);

  const resetForm = () => {
    setForm(emptyJobForm);
    setFormError('');
    setSuccessMessage('');
    setShowCreateForm(false);
    setEditingJobId(null);
  };

  const validateJobForm = () => {
    const trimmedTitle = String(form.title ?? '').trim();
    const trimmedDescription = String(form.description ?? '').trim();
    const companyId = Number(form.company_id ?? 0);

    if (!trimmedTitle) {
      return 'Job title is required.';
    }

    if (!companyId) {
      return 'Company ID is required.';
    }

    if (!trimmedDescription) {
      return 'Job description is required.';
    }

    if (trimmedDescription.length < 10) {
      return 'Description must be at least 10 characters long.';
    }

    return '';
  };

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase();
    return jobs.filter((job) => {
      const matchesFilter = filter === 'All' || (job.status ?? (job.is_active ? 'Published' : 'Draft')) === filter;
      const matchesSearch = `${job.title} ${job.department ?? ''} ${job.location ?? ''}`.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [jobs, filter, search]);

  const submitJob = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateJobForm();

    if (validationMessage) {
      setFormError(validationMessage);
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await onCreateJob(form);
      setForm(emptyJobForm);
      setShowCreateForm(false);
      setSuccessMessage('Job created successfully.');
    } catch {
      setFormError('Unable to create the job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (job: Job) => {
    setEditingJobId(job.id);
    setFormError('');
    setSuccessMessage('');
    setForm({
      title: job.title ?? '',
      company_id: Number(job.company_id ?? 1),
      description: job.description ?? '',
      requirements: job.description ?? '',
      location: job.location ?? '',
      job_type: job.job_type ?? '',
      experience_level: job.experience_level ?? '',
      salary_min: Number(job.salary_min ?? 0),
      salary_max: Number(job.salary_max ?? 0),
    });
  };

  const submitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingJobId === null) return;
    const validationMessage = validateJobForm();

    if (validationMessage) {
      setFormError(validationMessage);
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await onUpdateJob(editingJobId, form);
      setEditingJobId(null);
      setForm(emptyJobForm);
      setSuccessMessage('Job updated successfully.');
    } catch {
      setFormError('Unable to update the job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="page-overline">YOUR RECRUITMENT PIPELINE</div>
          <h1>Job postings</h1>
          <p>Create, organize, and track every open role in one place.</p>
        </div>
        <button type="button" className="primary-btn" onClick={() => {
          setForm(emptyJobForm);
          setFormError('');
          setSuccessMessage('');
          setShowCreateForm(true);
        }}>
          <Plus size={18} /> Create a job
        </button>
      </div>

      {successMessage && (
        <div className="page-alert success-message">{successMessage}</div>
      )}

      {(showCreateForm || editingJobId !== null) && (
        <form className="panel compact-form" onSubmit={editingJobId === null ? submitJob : submitEdit}>
          <div className="panel-heading">
            <div>
              <h3>{editingJobId === null ? 'Create job' : 'Edit job'}</h3>
              <p>Match the live backend schema.</p>
            </div>
            <button type="button" className="outline-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>

          {formError && <div className="page-alert error-message">{formError}</div>}

          <div className="stacked-field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Full-Stack Developer" />
          </div>

          <div className="stacked-field">
            <label>Company ID</label>
            <input type="number" value={form.company_id} onChange={(e) => setForm({ ...form, company_id: Number(e.target.value || 0) })} placeholder="1" />
          </div>

          <div className="stacked-field">
            <label>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role and responsibilities." />
          </div>

          <div className="stacked-field">
            <label>Requirements</label>
            <textarea rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Required skills and experience." />
          </div>

          <div className="stacked-field">
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / Austin / Hybrid" />
          </div>

          <div className="stacked-field">
            <label>Job Type</label>
            <input value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} placeholder="Full-time" />
          </div>

          <div className="stacked-field">
            <label>Experience Level</label>
            <input value={form.experience_level} onChange={(e) => setForm({ ...form, experience_level: e.target.value })} placeholder="Mid-Senior" />
          </div>

          <div className="stacked-field">
            <label>Salary Min</label>
            <input type="number" value={form.salary_min} onChange={(e) => setForm({ ...form, salary_min: Number(e.target.value || 0) })} placeholder="120000" />
          </div>

          <div className="stacked-field">
            <label>Salary Max</label>
            <input type="number" value={form.salary_max} onChange={(e) => setForm({ ...form, salary_max: Number(e.target.value || 0) })} placeholder="150000" />
          </div>

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spinner" /> {editingJobId === null ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              editingJobId === null ? 'Create job' : 'Save changes'
            )}
          </button>
        </form>
      )}

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input placeholder="Search job title, team or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="toolbar-right">
            <div className="select-wrap">
              <Filter size={15} />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>All</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Closed</option>
              </select>
            </div>
            <button type="button" className="outline-btn" onClick={() => void onRefresh()}>
              <Download size={15} /> Refresh
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>JOB TITLE</th>
                <th>STATUS</th>
                <th>APPLICANTS</th>
                <th>WORKPLACE</th>
                <th>POSTED ON</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={String(job.id)}>
                  <td>
                    <div className="table-job">
                      <div className="job-symbol">
                        <UsersRound size={17} />
                      </div>
                      <div>
                        <b>{job.title}</b>
                        <span>{job.department ?? 'General'} · {job.employment_type ?? job.job_type ?? 'Full-time'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={job.status ?? (job.is_active ? 'Published' : 'Draft')} />
                  </td>
                  <td>
                    <button type="button" className="applicant-count">
                      {job.applicants_count ?? 0} applicants
                    </button>
                  </td>
                  <td>
                    <div className="table-location">
                      {job.location ?? job.location_name ?? '—'}
                      <span>{job.work_mode ?? job.job_type ?? 'Full-time'}</span>
                    </div>
                  </td>
                  <td className="date-cell">{job.posted_at ?? job.created_at ?? '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" title="Edit job" onClick={() => startEdit(job)}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" title="Delete job" onClick={() => void onDeleteJob(String(job.id))}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredJobs.length === 0 && (
            <div className="empty-state">
              <UsersRound size={28} />
              <b>No jobs found</b>
              <span>Try another search or create a new role.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
