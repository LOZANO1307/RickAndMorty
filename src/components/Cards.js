import Card from "./Card";
import "./Cards.css";

export default function Cards({ characters, onDetail, highlightId, onRequestDelete }) {
  if (characters.length === 0) {
    return <p className="Cards-empty">No hay personajes por aquí.</p>;
  }

  return (
    <div className="Cards">
      {characters.map(
        ({
          id,
          name,
          status,
          species,
          gender,
          origin,
          location,
          image,
          episode,
        }) => (
          <Card
            key={id}
            id={id}
            highlight={highlightId === id}
            name={name}
            status={status}
            species={species}
            gender={gender}
            origin={origin}
            location={location}
            image={image}
            episodes={episode?.length ?? 0}
            onQuickDelete={() => onRequestDelete(id)}
            onDetail={() => onDetail(id)}
          />
        )
      )}
    </div>
  );
}
