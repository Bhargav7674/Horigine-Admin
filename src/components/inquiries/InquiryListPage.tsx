import { Search, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Inquiry } from '../../types';

interface InquiryListPageProps {
  inquiries: Inquiry[];
}

const formatDisplayDate = (value?: string) => {
  if (!value) return 'Recently';

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return value;
  }
};

const getStatusClass = (status?: string) => {
  const normalized = (status ?? 'new').toLowerCase();

  if (normalized === 'contacted') return 'status-reviewing';
  if (normalized === 'closed') return 'status-closed';
  return 'status-new';
};

export function InquiryListPage({ inquiries }: InquiryListPageProps) {
  const [search, setSearch] = useState('');

  const filteredInquiries = useMemo(() => {
    const term = search.toLowerCase();
    return inquiries.filter((inquiry) => {
      const text = `${inquiry.full_name} ${inquiry.work_email ?? inquiry.email ?? ''} ${inquiry.service_interest ?? ''} ${inquiry.message ?? ''}`.toLowerCase();
      return text.includes(term);
    });
  }, [inquiries, search]);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="page-overline">CLIENT AND CANDIDATE REQUESTS</div>
          <h1>Inquiries</h1>
          <p>View all incoming entries submitted through the website.</p>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input placeholder="Search name, email or service..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>SERVICE</th>
                <th>STATUS</th>
                <th>SUBMITTED</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <div className="candidate-cell">
                      <span className="avatar candidate-avatar mint">{(inquiry.full_name || 'IN').slice(0, 2).toUpperCase()}</span>
                      <span>
                        <b>{inquiry.full_name}</b>
                        <small>{inquiry.phone ?? 'No phone'}</small>
                      </span>
                    </div>
                  </td>
                  <td>{inquiry.work_email ?? inquiry.email ?? '—'}</td>
                  <td>{inquiry.service_interest ?? 'General'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(inquiry.status)}`}>
                      <i />
                      {inquiry.status ?? 'new'}
                    </span>
                  </td>
                  <td className="date-cell">{formatDisplayDate(inquiry.created_at ?? inquiry.submitted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInquiries.length === 0 && (
            <div className="empty-state">
              <UserRound size={28} />
              <b>No inquiries found</b>
              <span>There are no matching form entries right now.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
