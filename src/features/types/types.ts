export type Film = { id: number; title: string; url: string };
export type Starship = { id: number; name: string; url: string };
export type Person = {
  id?: number;
  url?: string;
  name: string;
  films: string[];
  starships: string[];
};
export type PeoplePage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
};
