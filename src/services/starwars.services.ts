import { ENV } from "@/config/env";
import { http } from "@/lib/http";
import type {
  PeoplePage,
  PersonDto,
  FilmDto,
  StarshipDto,
} from "@/features/types/types";
import { getIdFromUrl } from "../utils/lib";
import { mapPersonDto, mapFilmDto, mapStarshipDto } from "@/utils/mapper";
import type { ListResponse } from "@/types/index";

const BASE_URL = ENV.SWAPI_BASE_URL;

function toIds(list: Array<number | string>): number[] {
  return list.map((v) => (typeof v === "number" ? v : getIdFromUrl(v)));
}

const httpList = async <T>(url: string): Promise<T[]> => {
  const res = await http<ListResponse<T>>(url);
  return res.results;
};

export const sw = {
  getPeople: (page = 1) =>
    http<ListResponse<PersonDto>>(`${BASE_URL}/people/?page=${page}`).then(
      (res) => ({
        ...res,
        results: res.results.map(mapPersonDto),
      })
    ) as Promise<PeoplePage>,

  getPerson: (id: number) =>
    http<PersonDto>(`${BASE_URL}/people/${id}/`).then(mapPersonDto),

  getFilm: (id: number) =>
    http<FilmDto>(`${BASE_URL}/films/${id}/`).then(mapFilmDto),

  getStarship: (id: number) =>
    http<StarshipDto>(`${BASE_URL}/starships/${id}/`).then(mapStarshipDto),

  getFilms: (list: Array<number | string>) =>
    Promise.all(toIds(list).map((id) => sw.getFilm(id))),

  getStarships: (list: Array<number | string>) =>
    Promise.all(toIds(list).map((id) => sw.getStarship(id))),

  getFilmsByCharacter: (personId: number) =>
    httpList<FilmDto>(`${BASE_URL}/films/?characters=${personId}`).then((arr) =>
      arr.map(mapFilmDto)
    ),

  getStarshipsByPilot: (personId: number) =>
    httpList<StarshipDto>(`${BASE_URL}/starships/?pilots=${personId}`).then(
      (arr) => arr.map(mapStarshipDto)
    ),
};
