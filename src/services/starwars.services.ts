import { ENV } from "@/config/env";
import { http } from "@/lib/http";
import type {
  PeoplePage,
  Person,
  Film,
  Starship,
} from "@/features/types/types";
import { getIdFromUrl } from "../utils/lib";

const BASE_URL = ENV.SWAPI_BASE_URL;

function toIds(list: Array<number | string>): number[] {
  return list.map((v) => (typeof v === "number" ? v : getIdFromUrl(v)));
}

export const sw = {
  getPeople: (page = 1) => http<PeoplePage>(`${BASE_URL}/people/?page=${page}`),
  getPerson: (id: number) => http<Person>(`${BASE_URL}/people/${id}/`),
  getFilm: (id: number) => http<Film>(`${BASE_URL}/films/${id}/`),
  getStarship: (id: number) => http<Starship>(`${BASE_URL}/starships/${id}/`),
  getFilms: (list: Array<number | string>) =>
    Promise.all(toIds(list).map((id) => sw.getFilm(id))),
  getStarships: (list: Array<number | string>) =>
    Promise.all(toIds(list).map((id) => sw.getStarship(id))),
  getManyByUrls<T>(urls: string[]) {
    return Promise.all(
      urls.map((url) =>
        http<T>(url.startsWith("http") ? url : `${BASE_URL}${url}`)
      )
    );
  },
};
