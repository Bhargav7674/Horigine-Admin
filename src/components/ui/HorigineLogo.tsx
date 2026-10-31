type HorigineLogoProps = {
  compact?: boolean;
};

export function HorigineLogo({ compact = false }: HorigineLogoProps) {
  return (
    <div className={`horigine-logo ${compact ? 'compact' : ''}`} aria-label="Horigine logo">
      <img src="/horigine-logo.svg" alt="Horigine" />
    </div>
  );
}
