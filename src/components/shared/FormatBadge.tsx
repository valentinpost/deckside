interface FormatBadgeProps {
  format: string | undefined;
}

export function FormatBadge({ format }: FormatBadgeProps) {
  if (!format) return null;
  const formatTitleCase = format.charAt(0).toUpperCase() + format.substring(1).toLowerCase();
  return <span className="format-badge">{formatTitleCase}</span>;
}
