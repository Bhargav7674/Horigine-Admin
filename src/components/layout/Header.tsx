import { Bell, CalendarDays, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
  onNotify: () => void;
  mobileNavOpen: boolean;
}

export function Header({ title, onMenuToggle, onNotify, mobileNavOpen }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="mobile-menu" onClick={onMenuToggle} aria-label="Toggle navigation">
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          Workspace <span>/</span> <b>{title}</b>
        </div>
      </div>

      <div className="topbar-right">
        <div className="today">
          <CalendarDays size={15} />
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <button type="button" className="icon-btn notification-btn" onClick={onNotify} aria-label="Notifications">
          <Bell size={18} />
          <i />
        </button>
        <div className="top-avatar">BH</div>
      </div>
    </header>
  );
}
