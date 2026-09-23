import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmLoading = false,
  confirmDisabled = false,
  showFooter = true,
  size = "small",
}) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !confirmLoading) {
      onClose?.();
    }
  };

  return (
    <div className="app-modal-overlay" onClick={handleOverlayClick}>
      <div className={`app-modal app-modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="app-modal-header">
          <h3 id="app-modal-title">{title}</h3>

          <button
            type="button"
            className="app-modal-close"
            onClick={onClose}
            disabled={confirmLoading}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================================
            CONTENT
        ========================================= */}

        <div className="app-modal-body">{children}</div>

        {/* =========================================
            FOOTER
        ========================================= */}

        {showFooter && (
          <div className="app-modal-footer">
            <button type="button" className="app-modal-cancel" onClick={onClose} disabled={confirmLoading}>
              {cancelText}
            </button>

            <button
              type="button"
              className="app-modal-confirm"
              onClick={onConfirm}
              disabled={confirmLoading || confirmDisabled}
            >
              {confirmLoading ? "Please wait..." : confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
