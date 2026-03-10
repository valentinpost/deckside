export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="spinner" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
