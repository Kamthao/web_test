import { Circle } from "lucide-react";

export default function StatusBadge({ status }) {
  const isActive = status === "active";
  return (
    <span className={`status-badge ${isActive ? "is-active" : "is-inactive"}`}>
      <Circle size={8} fill="currentColor" aria-hidden="true" />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
