"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePeopleInfinite } from "../api/queries";
import { ensureId } from "@/utils/lib";
import { CardSkeleton } from "@/components/Skeleton";
import HeroCard from "./HeroCard";

// HOK
const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </ul>
  );
};

const PeopleList = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Retrun result in hooks Infinit query hooks
  const {
    data,
    isLoading,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
  } = usePeopleInfinite();

  // Memorise peaople result
  const people = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data]
  );

  const [visiblePeople, setVisiblePeople] = useState<typeof people>([]);
  const [hasAnyData, setHasAnyData] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (people.length > 0) {
      const sameLen = visiblePeople.length === people.length;
      const same =
        sameLen &&
        visiblePeople.every((v, i) => ensureId(v) === ensureId(people[i]));
      if (!same) {
        setVisiblePeople(people);
        setHasAnyData(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people]);

  const showInitialSkeleton = !hasAnyData && (isLoading || isPending);

  // Use effect to create response with IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "100px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [people.length]);

  // Use effect for displayed next people stream
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  if (isError) {
    return <div className="card text-red-600">Failed to load heroes.</div>;
  }

  return (
    <>
      <Grid>
        {showInitialSkeleton
          ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
          : visiblePeople.map((p) => <HeroCard key={ensureId(p)} p={p} />)}
      </Grid>

      <div ref={sentinelRef} className="h-8" />

      {isFetchingNextPage && (
        <p className="mt-2 text-center text-sm opacity-70">Loading…</p>
      )}
      {!hasNextPage && hasAnyData && (
        <p className="mt-2 text-center text-sm opacity-70">No more heroes.</p>
      )}
    </>
  );
};

export default PeopleList;
