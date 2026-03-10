import { AlertCircleIcon } from '@/components/icons';

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="banner-error">
      <AlertCircleIcon className="text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-red-200 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
