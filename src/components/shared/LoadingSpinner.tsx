export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <p className="message">{message}</p>
    </div>
  );
}
