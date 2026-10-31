import { ArrowLeft, Calendar, Dna, Globe, MapPin, Tag, Trash2, Tv, User } from "lucide-react";
import "./CharacterDetail.css";
import { genderLabel, speciesLabel, statusLabel } from "../utils/translations";

// Vista de detalle de un personaje. Mientras esté abierta reemplaza a la lista.
export default function CharacterDetail({
  character,
  episodes,
  isLoadingEpisodes,
  onBack,
  onDelete,
}) {
  if (!character) return null;

  const episodeCount = character.episode?.length ?? 0;
  const statusClass =
    character.status === "Alive"
      ? "alive"
      : character.status === "Dead"
      ? "dead"
      : "unknown";

  return (
    <section className="Detail">
      <button className="Detail-back" onClick={onBack}>
        <ArrowLeft size={15} />
         Volver a la lista
      </button>

      <article className="Detail-card">
        <div className="Detail-media">
          <img src={character.image} alt={character.name} />
          <span className={`Detail-status ${statusClass}`}>{statusLabel(character.status, character.gender)}</span>
        </div>

        <div className="Detail-info">
          <h1 className="Detail-name">{character.name}</h1>
          <ul className="Detail-facts">
            <li>
              <span className="Detail-fact-ico" aria-hidden="true"><Dna size={14} /></span>
              <div>
                <small>Especie</small>
                <b>{speciesLabel(character.species, character.gender)}</b>
              </div>
            </li>
            <li>
              <span className="Detail-fact-ico" aria-hidden="true"><User size={14} /></span>
              <div>
                <small>Género</small>
                <b>{genderLabel(character.gender)}</b>
              </div>
            </li>
            <li>
              <span className="Detail-fact-ico" aria-hidden="true"><Tag size={14} /></span>
              <div>
                <small>Tipo</small>
                <b>{character.type || "—"}</b>
              </div>
            </li>
            <li>
              <span className="Detail-fact-ico" aria-hidden="true"><MapPin size={14} /></span>
              <div>
                <small>Ubicación</small>
                <b>{character.location?.name ?? "Desconocida"}</b>
              </div>
            </li>
            <li>
              <span className="Detail-fact-ico" aria-hidden="true"><Globe size={14} /></span>
              <div>
                <small>Origen</small>
                <b>{character.origin?.name ?? "Desconocido"}</b>
              </div>
            </li>
            <li>
              <span className="Detail-fact-ico" aria-hidden="true"><Calendar size={14} /></span>
              <div>
                <small>Creado</small>
                <b>{new Date(character.created).toLocaleDateString()}</b>
              </div>
            </li>
          </ul>
          <div className="Detail-actions">
            <button className="Detail-delete" onClick={onDelete}>
              <Trash2 size={15} />
              Eliminar de la lista
            </button>
          </div>
        </div>
      </article>

      <div className="Detail-episodes">
        <h2>
          <Tv size={15} aria-hidden="true" />
          {episodeCount === 1 ? "1 episodio" : `Episodios (${episodeCount})`}
          {isLoadingEpisodes && <span className="Detail-spinner" />}
        </h2>
        {episodes && episodes.length === 0 && (
          <p className="Detail-episodes-empty">
            No se pudieron traer los episodios por ahora.
          </p>
        )}
        {episodes && episodes.length > 0 && (
          <ul>
            {episodes.map((episode) => (
              <li key={episode.id}>
                <span className="Detail-epCode">{episode.episode}</span>
                {episode.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
