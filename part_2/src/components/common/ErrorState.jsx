import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <AlertTriangle size={28} className="state-icon" aria-hidden="true" />
      <p className="error-state-title">{title}</p>
      {message && <p className="error-state-desc">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
