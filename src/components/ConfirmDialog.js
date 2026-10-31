import { useEffect } from "react";
import "./ConfirmDialog.css";

// Modal de confirmacion, se cierra con Esc, fuera o Cancelar
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Eliminar",
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="ConfirmDialog-backdrop"
      role="dialog"
      aria-label={title}
      onClick={onCancel}
    >
      <div className="ConfirmDialog-card" onClick={(event) => event.stopPropagation()}>
        <h2 className="ConfirmDialog-title">{title}</h2>
        <p className="ConfirmDialog-message">{message}</p>
        <div className="ConfirmDialog-actions">
          <button className="ConfirmDialog-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="ConfirmDialog-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
