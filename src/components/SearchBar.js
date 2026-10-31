import { useEffect, useRef, useState } from "react";
import { Hash, Shuffle } from "lucide-react";
import "./SearchBar.css";
import Suggestions from "./Suggestions";

export default function SearchBar({
  onSearch,
  onRandom,
  isLoading,
  onQuery,
  suggestions,
}) {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Sugiere 350ms despues de dejar de tipear
  useEffect(() => {
    const timer = setTimeout(() => onQuery(text), 350);
    return () => clearTimeout(timer);
  }, [text, onQuery]);

  // Cierra el desplegable al clickar fuera
  useEffect(() => {
    const onDocClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleChange = (event) => {
    setText(event.target.value);
    setIsOpen(Boolean(event.target.value.trim()));
  };

  const pick = (item) => {
    onSearch(String(item.id));
    setText("");
    setIsOpen(false);
  };

  const open = isOpen && suggestions !== null;

  return (
    <div className="SearchBar" ref={containerRef}>
      <input
        id="search"
        className="SearchBar-input"
        type="search"
        placeholder="ID o nombre del personaje..."
        value={text}
        onChange={handleChange}
        onFocus={() => text.trim() && setIsOpen(true)}
        disabled={isLoading}
      />
      <button
        className="SearchBar-button"
        onClick={() => onSearch(text)}
        disabled={isLoading}
      >
        Agregar
      </button>
      <button
        className="SearchBar-button SearchBar-random"
        onClick={onRandom}
        disabled={isLoading}
        title="Traer un personaje aleatorio"
      >
        <Shuffle size={15} aria-hidden="true" />
      </button>
      {isLoading && <span className="SearchBar-spinner" aria-label="Cargando" />}
      {open && <Suggestions items={suggestions} onPick={pick} />}
    </div>
  );
}
