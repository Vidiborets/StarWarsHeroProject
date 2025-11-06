"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { sw } from "@/services/starwars.services";
import type { PeoplePage, Person } from "../../types/people.types";

export const qk = {
  people: ["people"] as const,
  person: (id: number) => ["person", id] as const,
};

export function usePeopleInfinite() {
  return useInfiniteQuery<PeoplePage>({
    queryKey: qk.people,
    queryFn: (context) => sw.getPeople(context.pageParam as number),
    getNextPageParam: (last) => {
      if (!last.next) return undefined;
      const u = new URL(last.next);
      return Number(u.searchParams.get("page") || 0);
    },
    initialPageParam: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });
}

export function usePerson(id: number) {
  return useQuery<Person>({
    queryKey: qk.person(id),
    queryFn: () => sw.getPerson(id),
  });
}
