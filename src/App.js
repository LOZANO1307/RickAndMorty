import { Rocket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Cards from "./components/Cards";
import CharacterDetail from "./components/CharacterDetail";
import ConfirmDialog from "./components/ConfirmDialog";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import Toasts from "./components/Toasts";
import {
  fetchCharacter,
  fetchCharacterEpisodes,
  fetchCharacterPage,
  fetchCharactersByName,
  fetchRandomCharacter,
} from "./services/fetchCharacter";

function App() {
  const [characters, setCharacters] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);

  // Notificaciones con auto-descarte
  const notify = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4200);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    fetchCharacterPage(1)
      .then(setCharacters)
      .catch(() => notify("error", "No se pudo cargar la lista inicial de personajes"));
  }, []);

  // Trae los episodios del personaje abierto en el detalle
  useEffect(() => {
    if (!selectedId) return;
    const character = characters.find((c) => c.id === selectedId);
    if (!character) return;

    setIsLoadingEpisodes(true);
    setEpisodes(null);

    fetchCharacterEpisodes(character.episode)
      .then(setEpisodes)
      .catch(() => setEpisodes([]))
      .finally(() => setIsLoadingEpisodes(false));
  }, [selectedId]);

  // Sugiere personajes mientras se escribe (si es numero, busca por ID)
  const onQuery = useCallback(async (value) => {
    const query = value.trim();

    if (!query) {
      setSuggestions(null);
      return;
    }

    const id = Number(query);
    if (Number.isInteger(id) && id >= 1) {
      setSuggestions([
        { byId: true, id, name: `Agregar personaje con ID ${id}` },
      ]);
      return;
    }

    if (query.length < 2) {
      setSuggestions(null);
      return;
    }

    const results = await fetchCharactersByName(query);
    setSuggestions(
      results.slice(0, 6).map((character) => ({
        id: character.id,
        name: character.name,
        status: character.status,
        gender: character.gender,
        image: character.image,
      }))
    );
  }, []);

  // Desplaza la página hasta el personaje recién agregado
  useEffect(() => {
    if (lastAddedId == null) return;
    if (!characters.some((character) => character.id === lastAddedId)) return;

    const node = document.querySelector(`[data-character-id="${lastAddedId}"]`);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // al soltar el highlight, la clase sale sola del render
    const timer = setTimeout(() => setLastAddedId(null), 1800);
    return () => clearTimeout(timer);
  }, [lastAddedId, characters]);

  const addCharacters = (incoming) => {
    const fresh = incoming.filter(
      (character) => !characters.some((existing) => existing.id === character.id)
    );

    if (fresh.length > 0) {
      setFilter("all");           // para que la card nueva sea visible
      setSelectedId(null);        // si estaba un detalle abierto, vuelve a la lista
      setCharacters((prev) => [...prev, ...fresh]);
      setLastAddedId(fresh[0].id); // dispara el scroll automático
    }
    if (fresh.length === 0) {
      notify(
        "warning",
        incoming.length === 1
          ? `"${incoming[0].name}" ya está en la lista`
          : "Esos personajes ya estaban en la lista"
      );
    } else {
      if (fresh.length === 1) {
        notify("success", `"${fresh[0].name}" llegó a la lista`);
      } else {
        notify("success", `${fresh.length} personajes agregados a la lista`);
      }
    }
  };

  const onSearch = async (value) => {
    const query = value.trim();

    if (!query) {
      notify("error", "Escribe un ID o el nombre de un personaje");
      return;
    }

    setIsLoading(true);
    try {
      const id = Number(query);

      if (Number.isInteger(id) && id >= 1) {
        const character = await fetchCharacter(id);
        if (character) {
          addCharacters([character]);
        } else {
          notify("error", `No hay ningún personaje con el ID ${id}`);
        }
      } else {
        const results = await fetchCharactersByName(query);
        if (results.length > 0) {
          addCharacters(results);
        } else {
          notify("error", `No hay personajes con el nombre "${query}"`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRandom = async () => {
    setIsLoading(true);
    try {
      const character = await fetchRandomCharacter();
      if (character) {
        addCharacters([character]);
      } else {
        notify("error", "No se pudo traer un personaje aleatorio");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pide confirmacion antes de eliminar
  const askDelete = (id) => {
    const character = characters.find((c) => c.id === id);
    const name = character?.name ?? "este personaje";

    setConfirmData({
      title: "Eliminar personaje",
      message: `¿Seguro que quieres eliminar a "${name}" de la lista?`,
      onConfirm: () => {
        setCharacters((prev) => prev.filter((c) => c.id !== id));
        if (selectedId === id) setSelectedId(null);
        notify("info", `"${name}" eliminado de la lista`);
      },
    });
  };

  const counts = {
    all: characters.length,
    Alive: characters.filter((c) => c.status === "Alive").length,
    Dead: characters.filter((c) => c.status === "Dead").length,
    unknown: characters.filter(
      (c) => c.status !== "Alive" && c.status !== "Dead"
    ).length,
  };

  const filtered =
    filter === "all"
      ? characters
      : characters.filter((c) => c.status === filter);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">
          <span className="App-title-icon" aria-hidden="true">
            <Rocket size={30} />
          </span>
          Rick &amp; Morty App
        </h1>
        <SearchBar
          onSearch={onSearch}
          onRandom={onRandom}
          isLoading={isLoading}
          onQuery={onQuery}
          suggestions={suggestions}
        />
      </header>
      <FilterBar value={filter} counts={counts} onFilter={setFilter} />
      <main>
        {selectedId != null ? (
          <CharacterDetail
            character={characters.find((c) => c.id === selectedId)}
            episodes={episodes}
            isLoadingEpisodes={isLoadingEpisodes}
            onBack={() => setSelectedId(null)}
            onDelete={() => askDelete(selectedId)}
          />
        ) : (
          <Cards
            characters={filtered}
            onDetail={(id) => setSelectedId(id)}
            highlightId={lastAddedId}
            onRequestDelete={askDelete}
          />
        )}
      </main>
      <footer className="App-footer">Datos: rickandmortyapi.com</footer>
      <Toasts items={toasts} onDismiss={dismissToast} />
      {confirmData && (
        <ConfirmDialog
          title={confirmData.title}
          message={confirmData.message}
          onCancel={() => setConfirmData(null)}
          onConfirm={() => {
            confirmData.onConfirm();
            setConfirmData(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
