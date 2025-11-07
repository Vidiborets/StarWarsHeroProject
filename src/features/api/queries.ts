"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { sw } from "@/services/starwars.services";
import type { Film, Starship, Person } from "../types/types";

export function usePerson(id: number) {
  return useQuery<Person>({
    queryKey: ["person", id],
    enabled: Number.isFinite(id) && id > 0,
    queryFn: () => sw.getPerson(id),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
}

export function usePersonFilms(person: Person | undefined) {
  return useQuery<Film[]>({
    queryKey: ["person-films", person?.id],
    enabled: !!person && person.films.length > 0,
    queryFn: () => sw.getFilms(person!.films),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
}

export function usePersonShips(person: Person | undefined) {
  return useQuery<Starship[]>({
    queryKey: ["person-ships", person?.id],
    enabled: !!person && person.starships.length > 0,
    queryFn: () => sw.getStarships(person!.starships),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
}

export function usePersonAggregate(id: number) {
  const personQ = usePerson(id);
  const filmsQ = usePersonFilms(personQ.data);
  const shipsQ = usePersonShips(personQ.data);

  const isLoading = personQ.isLoading || filmsQ.isLoading || shipsQ.isLoading;
  const isError = personQ.isError || filmsQ.isError || shipsQ.isError;

  const data = useMemo(() => {
    if (!personQ.data) return undefined;
    return {
      person: personQ.data,
      films: filmsQ.data ?? [],
      ships: shipsQ.data ?? [],
    };
  }, [personQ.data, filmsQ.data, shipsQ.data]);

  return {
    data,
    isLoading,
    isError,
  };
}
