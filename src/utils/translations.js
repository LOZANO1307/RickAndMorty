// Traducciones al español de los valores de la API de Rick & Morty.
// Si un valor no está en los diccionarios, se muestra tal cual llega.

const GENDERS = {
  Male: "Masculino",
  Female: "Femenino",
  Genderless: "Sin género",
  unknown: "Desconocido",
};

const SPECIES = {
  Human: ["Humano", "Humana"],
  Alien: ["Alien", "Alien"],
  Robot: ["Robot", "Robot"],
  Animal: ["Animal", "Animal"],
  Humanoid: ["Humanoide", "Humanoide"],
  Mutant: ["Mutante", "Mutante"],
  Vampire: ["Vampiro", "Vampira"],
  "Mythological Creature": ["Criatura mitológica", "Criatura mitológica"],
  "Genetic experiment": ["Experimento genético", "Experimento genético"],
  "Genetic Experiment": ["Experimento genético", "Experimento genético"],
  Disease: ["Enfermedad", "Enfermedad"],
  "Superhuman (with special powers)": ["Superhumano", "Superhumana"],
};

export const genderLabel = (gender) => GENDERS[gender] ?? gender;

export const statusLabel = (status, gender = "Male") => {
  const female = gender === "Female";
  if (status === "Alive") return female ? "Viva" : "Vivo";
  if (status === "Dead") return female ? "Muerta" : "Muerto";
  if (status === "unknown") return "Desconocido";
  return status;
};

export const speciesLabel = (species, gender = "Male") => {
  const entry = SPECIES[species];
  if (!entry) return species;
  return gender === "Female" ? entry[1] : entry[0];
};
