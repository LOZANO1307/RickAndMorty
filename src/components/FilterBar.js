import "./FilterBar.css";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "Alive", label: "Vivos" },
  { id: "Dead", label: "Muertos" },
  { id: "unknown", label: "Desconocidos" },
];

export default function FilterBar({ value, counts, onFilter }) {
  return (
    <div className="FilterBar">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          className={`FilterBar-button${value === id ? " active" : ""}`}
          onClick={() => onFilter(id)}
        >
          {label} ({counts[id] ?? 0})
        </button>
      ))}
    </div>
  );
}
