export default function Spinner({ label = "Loading…", size = "md" }) {
  return (
    <div className={`spinner-wrap spinner-${size}`} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="spinner-label">{label}</span>
    </div>
  );
}
