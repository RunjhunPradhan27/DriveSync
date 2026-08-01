import { AlertTriangle } from 'lucide-react';

/**
 * Inline error banner. Same `message` prop and default export as before.
 */
const ErrorBanner = ({ message }) => (
  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
    <span>{message || 'Something went wrong. Please try again.'}</span>
  </div>
);

export default ErrorBanner;
