import { AlertCircleIcon } from '@/components/icons';

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-banner">
      <AlertCircleIcon className="icon" />
      <div className="body">
        <p className="message">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="retry-btn"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
