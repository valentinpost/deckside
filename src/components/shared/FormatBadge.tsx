interface FormatBadgeProps {
  format: string | undefined;
}

export function FormatBadge({ format }: FormatBadgeProps) {
  if (!format) return null;
  return <span className="format-badge">{format}</span>;
}
