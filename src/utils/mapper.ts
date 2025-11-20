import type {
  PersonDto,
  FilmDto,
  StarshipDto,
  Person,
  Film,
  Starship,
} from "@/features/types/types";

export const mapPersonDto = (dto: PersonDto): Person => ({
  id: dto.id,
  name: dto.name,
  height: dto.height,
  mass: dto.mass,
  hairColor: dto.hair_color,
  skinColor: dto.skin_color,
  eyeColor: dto.eye_color,
  birthYear: dto.birth_year,
  gender: dto.gender,
  homeworld: dto.homeworld,
  films: dto.films,
  species: dto.species,
  starships: dto.starships,
  vehicles: dto.vehicles,
});

export const mapFilmDto = (dto: FilmDto): Film => ({
  id: dto.id,
  title: dto.title,
  url: dto.url,
});

export const mapStarshipDto = (dto: StarshipDto): Starship => ({
  id: dto.id,
  name: dto.name,
  url: dto.url,
});
