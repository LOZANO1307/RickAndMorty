import { Dna, Globe, MapPin, Tv, User, Trash2 } from "lucide-react";
import "./Card.css";
import { genderLabel, speciesLabel, statusLabel } from "../utils/translations";

export default function Card({
  id,
  highlight,
  name,
  status,
  species,
  gender,
  origin,
  location,
  image,
  episodes,
  onQuickDelete,
  onDetail,
}) {
  const statusClass =
    status === "Alive" ? "alive" : status === "Dead" ? "dead" : "unknown";

  const episodeCount = episodes ?? 0;

  return (
    <article
      className={`Card${highlight ? " Card-highlight" : ""}`}
      data-character-id={id}
      onClick={onDetail}
    >
      <div className="Card-actions">
        <button
          className="Card-iconbtn"
          onClick={(event) => {
            event.stopPropagation(); // no debe abrir el detalle
            onQuickDelete();
          }}
          aria-label={`Eliminar a ${name}`}
          title="Eliminar de la lista"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="Card-media">
        <img src={image} alt={name} loading="lazy" />
        <span className={`Card-status ${statusClass}`}>{statusLabel(status, gender)}</span>
      </div>
      <div className="Card-body">
        <h2 className="Card-name">{name}</h2>
        <ul className="Card-facts">
          <li>
            <span className="Card-fact-label">
              <Dna size={13} aria-hidden="true" />
              Especie
            </span>
            <span className="Card-fact-value">{speciesLabel(species, gender)}</span>
          </li>
          <li>
            <span className="Card-fact-label">
              <User size={13} aria-hidden="true" />
              Género
            </span>
            <span className="Card-fact-value">{genderLabel(gender)}</span>
          </li>
          <li>
            <span className="Card-fact-label">
              <Globe size={13} aria-hidden="true" />
              Origen
            </span>
            <span className="Card-fact-value">{origin?.name ?? "Desconocido"}</span>
          </li>
          <li>
            <span className="Card-fact-label">
              <MapPin size={13} aria-hidden="true" />
              Ubicación
            </span>
            <span className="Card-fact-value">{location?.name ?? "Desconocida"}</span>
          </li>
          <li>
            <span className="Card-fact-label">
              <Tv size={13} aria-hidden="true" />
              Episodios
            </span>
            <span className="Card-fact-value">{episodeCount}</span>
          </li>
        </ul>
      </div>
    </article>
  );
}
