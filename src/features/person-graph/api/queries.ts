"use client";
import { useQuery } from "@tanstack/react-query";
import { sw } from "@/services/starwars.services";
import type { Film, Starship, Person } from "../../types/person.types";

export function usePersonAggregate(id: number) {
  return useQuery({
    queryKey: ["person-agg", id],
    queryFn: async () => {
      const p = (await sw.getPerson(id)) as Person;
      const [films, ships]: [Film[], Starship[]] = await Promise.all([
        sw.getFilms(p.films),
        sw.getStarships(p.starships),
      ]);
      return { person: p, films, ships };
    },
  });
}
