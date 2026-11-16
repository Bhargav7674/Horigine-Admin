import { ExternalLink, Facebook, Globe, Instagram, Linkedin, Link2, Pencil, Plus, Trash2, Twitter, Youtube } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { SocialLink, SocialLinkPayload } from '../../types';

interface SocialLinksPageProps {
  socialLinks: SocialLink[];
  onCreateLink: (payload: SocialLinkPayload) => Promise<void>;
  onUpdateLink: (linkId: number | string, payload: Partial<SocialLinkPayload>) => Promise<void>;
  onDeleteLink: (linkId: number | string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

const PLATFORM_OPTIONS = ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter', 'Other'];

const normalizePlatform = (platform: string) => platform?.trim() || 'Other';

const getPlatformIcon = (platform: string) => {
  const normalized = normalizePlatform(platform).toLowerCase();

  if (normalized.includes('instagram')) return Instagram;
  if (normalized.includes('facebook')) return Facebook;
  if (normalized.includes('linkedin')) return Linkedin;
  if (normalized.includes('youtube')) return Youtube;
  if (normalized.includes('twitter') || normalized.includes('x.com')) return Twitter;
  return Globe;
};

const getDefaultUrlForPlatform = (platform: string) => {
  const normalized = normalizePlatform(platform).toLowerCase();

  if (normalized.includes('instagram')) return 'https://instagram.com/';
  if (normalized.includes('facebook')) return 'https://facebook.com/';
  if (normalized.includes('linkedin')) return 'https://linkedin.com/company/';
  if (normalized.includes('youtube')) return 'https://youtube.com/@';
  if (normalized.includes('twitter') || normalized.includes('x.com')) return 'https://x.com/';

  return 'https://example.com/';
};

export function SocialLinksPage({ socialLinks, onCreateLink, onUpdateLink, onDeleteLink, onRefresh }: SocialLinksPageProps) {
  const [form, setForm] = useState<SocialLinkPayload>({
    platform: 'Instagram',
    url: '',
    is_active: true,
    display_order: 1,
  });
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    void onRefresh();
  }, [onRefresh]);

  const sortedLinks = useMemo(
    () => [...socialLinks].sort((a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0)),
    [socialLinks],
  );

  const handlePlatformChange = (platform: string) => {
    setForm((current) => ({
      ...current,
      platform,
      url: '',
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      platform: 'Instagram',
      url: '',
      is_active: true,
      display_order: (sortedLinks.length || 0) + 1,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const trimmedUrl = form.url.trim();
      const trimmedPlatform = normalizePlatform(form.platform);

      if (!trimmedUrl || !/^https?:\/\//i.test(trimmedUrl)) {
        throw new Error('Please enter a valid full URL starting with http:// or https://');
      }

      const payload: SocialLinkPayload = {
        platform: trimmedPlatform,
        url: trimmedUrl,
        is_active: form.is_active ?? true,
        display_order: Number(form.display_order ?? 0),
      };

      if (editingId !== null) {
        await onUpdateLink(editingId, payload);
        setSuccess('Social link updated successfully.');
      } else {
        await onCreateLink(payload);
        setSuccess('Social link created successfully.');
      }

      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save social link.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id ?? null);
    setForm({
      platform: link.platform,
      url: link.url,
      is_active: link.is_active,
      display_order: Number(link.display_order ?? 0),
    });
  };

  const handleDelete = async (linkId: number | string) => {
    setError('');
    setSuccess('');
    try {
      await onDeleteLink(linkId);
      setSuccess('Social link deleted successfully.');
      if (editingId === linkId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete social link.');
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="page-overline">SOCIAL MEDIA</div>
          <h1>Social Links</h1>
          <p>Manage the public social channels shown on the website and keep each profile URL up to date.</p>
        </div>
      </div>

      {error && <div className="page-alert error-message">{error}</div>}
      {success && <div className="page-alert success-message">{success}</div>}

      <div className="user-role-layout">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Active social channels</h3>
              <p>Click a link to open the profile in a new tab.</p>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>PLATFORM</th>
                  <th>URL</th>
                  <th>STATUS</th>
                  <th>ORDER</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {sortedLinks.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <Link2 size={20} />
                        <b>No social links yet</b>
                        <span>Add your first Instagram, Facebook, LinkedIn, YouTube, or X URL.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedLinks.map((link) => {
                    const Icon = getPlatformIcon(link.platform);
                    return (
                      <tr key={String(link.id ?? `${link.platform}-${link.display_order}`)}>
                        <td>
                          <div className="table-job">
                            <div className="job-symbol">
                              <Icon size={16} />
                            </div>
                            <div>
                              <b>{normalizePlatform(link.platform)}</b>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a href={link.url} target="_blank" rel="noreferrer" className="social-link-url">
                            {link.url}
                          </a>
                        </td>
                        <td>
                          <span className={`status-badge ${link.is_active ? 'status-published' : 'status-closed'}`}>
                            <i />
                            {link.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{link.display_order ?? 0}</td>
                        <td>
                          <div className="row-actions">
                            <button type="button" aria-label="Edit social link" onClick={() => handleEdit(link)}>
                              <Pencil size={14} />
                            </button>
                            <button type="button" aria-label="Delete social link" onClick={() => handleDelete(link.id ?? '')}>
                              <Trash2 size={14} />
                            </button>
                            <a href={link.url} target="_blank" rel="noreferrer" aria-label="Visit social link" className="inline-link-button">
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <form className="panel compact-form" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div>
              <h3>{editingId !== null ? 'Edit social link' : 'Create social link'}</h3>
              <p>{editingId !== null ? 'Update the selected platform link.' : 'Add a new social media profile.'}</p>
            </div>
          </div>

          <div className="stacked-field">
            <label>Platform</label>
            <select value={form.platform} onChange={(event) => handlePlatformChange(event.target.value)}>
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="stacked-field">
            <label>URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              placeholder="https://instagram.com/your-profile"
            />
          </div>

          <div className="stacked-field">
            <label>Display order</label>
            <input
              type="number"
              min={0}
              value={form.display_order ?? 0}
              onChange={(event) => setForm((current) => ({ ...current, display_order: Number(event.target.value) || 0 }))}
            />
          </div>

          <div className="stacked-field checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={Boolean(form.is_active)}
                onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
              />
              Active on website
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Saving...' : editingId !== null ? 'Update link' : 'Create link'}
            </button>
            {editingId !== null && (
              <button type="button" className="outline-btn secondary-action" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
