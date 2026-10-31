import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  tone: 'blue' | 'purple' | 'orange' | 'green';
}

export function StatCard({ icon, label, value, note, tone }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className={`stat-icon ${tone}`}>{icon}</span>
        <span className="stat-dot" />
      </div>
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}
