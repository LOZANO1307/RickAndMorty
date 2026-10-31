// Consumo de la API de Rick and Morty https://rickandmortyapi.com
const API_URL = "https://rickandmortyapi.com/api/character/";
const EPISODE_URL = "https://rickandmortyapi.com/api/episode/";

// Personaje por ID, null si no existe (404)
export async function fetchCharacter(id) {
  const res = await fetch(`${API_URL}${id}`);
  if (!res.ok) return null;
  return res.json();
}

// Busqueda por nombre, [] si no hay resultados
export async function fetchCharactersByName(name) {
  const res = await fetch(`${API_URL}?name=${encodeURIComponent(name)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results;
}

// Una pagina de resultados (20 por pagina), [] si falla
export async function fetchCharacterPage(page) {
  const res = await fetch(`${API_URL}?page=${page}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results;
}

// Personaje aleatorio entre todos los existentes
export async function fetchRandomCharacter() {
  const res = await fetch(API_URL);
  if (!res.ok) return null;
  const data = await res.json();
  const randomId = Math.floor(Math.random() * data.info.count) + 1;
  return fetchCharacter(randomId);
}

// Los episodios de un personaje, en tandas de 24 ids por llamada
export async function fetchCharacterEpisodes(episodeUrls) {
  const ids = (episodeUrls ?? []).map((url) => url.split("/").pop());
  const episodes = [];

  for (let i = 0; i < ids.length; i += 24) {
    const res = await fetch(`${EPISODE_URL}${ids.slice(i, i + 24).join(",")}`);
    if (!res.ok) continue;
    const data = await res.json();
    episodes.push(...(Array.isArray(data) ? data : [data]));
  }

  return episodes;
}
