import { BriefcaseBusiness, ChevronDown, FileText, LayoutDashboard, LogOut, Plus, Sparkles, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onCreateJob: () => void;
  onLogout: () => void;
  totalApplicants: number;
  userName?: string;
}

const navItems: Array<{ label: string; icon: ReactNode; count?: number }> = [
  { label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { label: 'Job postings', icon: <BriefcaseBusiness size={18} /> },
  { label: 'Inquiries', icon: <FileText size={18} /> },
  { label: 'Users & Roles', icon: <UsersRound size={18} /> },
];

export function Sidebar({ activePage, onNavigate, onCreateJob, onLogout, totalApplicants, userName = 'Admin' }: SidebarProps) {
  const displayName = userName?.trim() || 'Admin';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'A';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-row">
          <div className="brand-icon">H</div>
          <span>Horigine</span>
        </div>
        <span className="admin-chip">ADMIN</span>
      </div>

      <div className="workspace-switch">
        <div className="workspace-logo">
          <div className="workspace-logo-initial">{initials}</div>
        </div>
        <div>
          <b>{displayName}</b>
          <span>Recruitment workspace</span>
        </div>
        <ChevronDown size={15} />
      </div>

      <div className="nav-caption">WORKSPACE</div>
      <nav>
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.label)}
            className={`nav-item ${activePage === item.label ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.label === 'Inquiries' && <span className="nav-count">{totalApplicants}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="nav-caption">QUICK ACTIONS</div>
      <button type="button" className="nav-item" onClick={onCreateJob}>
        <Plus size={18} />
        <span>Create a job</span>
      </button>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">
            <Sparkles size={17} />
          </div>
          <b>Need a hand?</b>
          <p>Our team is here if you need help with hiring.</p>
          <a href="mailto:careers@horigine.com">
            Contact support <span>↗</span>
          </a>
        </div>

        <button type="button" className="profile-row" onClick={onLogout}>
          <div className="avatar admin-avatar">{initials}</div>
          <div className="profile-info">
            <b>{displayName}</b>
            <span>Administrator</span>
          </div>
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
