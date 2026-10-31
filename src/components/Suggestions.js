import { Hash } from "lucide-react";
import "./Suggestions.css";
import { statusLabel } from "../utils/translations";

// Coincidencias bajo la barra de busqueda
export default function Suggestions({ items, onPick }) {
  return (
    <div className="Suggestions">
      {items.length === 0 && (
        <div className="Suggestions-empty">No hay resultados para esa búsqueda</div>
      )}
      {items.map((item) => (
        <button
          key={item.byId ? `by-id-${item.id}` : `char-${item.id}`}
          className="Suggestions-item"
          onClick={() => onPick(item)}
        >
          {item.image ? (
            <img className="Suggestions-avatar" src={item.image} alt={item.name} />
          ) : (
            <span className="Suggestions-hash">
              <Hash size={15} aria-hidden="true" />
            </span>
          )}
          <span className="Suggestions-text">
            <span className="Suggestions-name">{item.name}</span>
            {item.status && (
              <span className="Suggestions-meta">
                {" "}· {statusLabel(item.status, item.gender)} · ID {item.id}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
