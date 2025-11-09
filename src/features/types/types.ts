export type Film = { id: number; title: string; url: string };
export type Starship = { id: number; name: string; url: string };

export type Person = {
  id?: number;
  name: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
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
