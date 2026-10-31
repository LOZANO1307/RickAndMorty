import { CircleCheck, CircleX, AlertTriangle, Info, X } from "lucide-react";
import "./Toasts.css";

const ICONOS = {
  success: CircleCheck,
  error: CircleX,
  warning: AlertTriangle,
  info: Info,
};

// Notificaciones de la esquina superior derecha
export default function Toasts({ items, onDismiss }) {
  return (
    <div className="Toasts">
      {items.map((toast) => {
        const Icon = ICONOS[toast.type] ?? Info;
        return (
          <div key={toast.id} className={`Toast ${toast.type}`}>
            <Icon size={16} aria-hidden="true" className="Toast-icon" />
            <span className="Toast-msg">{toast.message}</span>
            <button
              className="Toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
