"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { sw } from "@/services/starwars.services";
import type { Film, Starship, Person } from "../types/types";

// Use react-query hooks for person
export const usePerson = (id: number) => {
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
};

// Use react-query hooks for person-films
export const usePersonFilms = (person: Person | undefined) => {
  const personId = person?.id;

  return useQuery<Film[]>({
    queryKey: ["person-films", personId],
    enabled: !!personId,
    queryFn: () => sw.getFilmsByCharacter(personId!),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
};

// Use react-query hooks for person-ships
export const usePersonShips = (person: Person | undefined) => {
  const personId = person?.id;

  return useQuery<Starship[]>({
    queryKey: ["person-ships", personId],
    enabled: !!personId,
    queryFn: () => sw.getStarshipsByPilot(personId!),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
};

// Use react-query hooks for person-Aggregate
export const usePersonAggregate = (id: number) => {
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
};
