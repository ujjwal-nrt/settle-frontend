// src/components/common/Toast.jsx

import { CheckCircle2, XCircle, X } from "lucide-react";

export default function Toast({ show, type = "success", message, onClose }) {
  if (!show) return null;

  const isError = type === "error";

  return (
    <div className={`app-toast ${isError ? "app-toast-error" : "app-toast-success"}`} role="alert">
      <div className="app-toast-icon">{isError ? <XCircle size={20} /> : <CheckCircle2 size={20} />}</div>

      <span className="app-toast-message">{message}</span>

      <button type="button" className="app-toast-close" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
