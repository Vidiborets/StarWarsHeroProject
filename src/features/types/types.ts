export type Film = { id: number; title: string; url: string };
export type Starship = { id: number; name: string; url: string };

export type Person = {
  id: number;
  name: string;
  height?: string;
  mass?: string;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  birthYear?: string;
  gender?: string;
  homeworld?: number;
  films?: number[];
  species?: number[];
  starships?: number[];
  vehicles?: number[];
};

export type PeoplePage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
};

export type Props = { data: { name: string; title?: string } };
export interface WikiPage {
  thumbnail?: { source: string };
}

export type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export type PersonDto = {
  id: number;
  name: string;
  birth_year: string;
  eye_color: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: number;
  films: number[];
  species: number[];
  starships: number[];
  vehicles: number[];
  created: string;
  edited: string;
  url: string;
  gender: string;
};

export type FilmDto = {
  id: number;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: number[];
  planets: number[];
  species: number[];
  starships: number[];
  vehicles: number[];
  created: string;
  edited: string;
  url: string;
};

export type StarshipDto = {
  id: number;
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  films: number[];
  pilots: number[];
  created: string;
  edited: string;
  url: string;
};
