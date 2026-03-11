/** Format a timestamp as a human-readable relative time string */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const elapsedMs = now.getTime() - date.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedMinutes < 1) return 'just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  if (elapsedDays < 7) return `${elapsedDays}d ago`;
  return date.toLocaleDateString();
}
