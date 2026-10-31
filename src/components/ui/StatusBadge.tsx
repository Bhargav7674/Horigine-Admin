interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status?.toLowerCase() || 'draft';

  return (
    <span className={`status-badge status-${normalized}`}>
      <i />
      {status}
    </span>
  );
}
