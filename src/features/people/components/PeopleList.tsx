"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePeopleInfinite } from "../api/queries";
import { ensureId } from "@/utils/lib";
import LazyImage from "@/components/LazyImage";
import { CardSkeleton } from "@/components/Skeleton";
import type { ReactNode } from "react";

function Grid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </ul>
  );
}

export default function PeopleList() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
  } = usePeopleInfinite();

  const people = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data]
  );

  const [visiblePeople, setVisiblePeople] = useState<typeof people>([]);
  const [hasAnyData, setHasAnyData] = useState(false);

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

  const [inView, setInView] = useState(false);

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
          : visiblePeople.map((p) => {
              const id = ensureId(p);
              return (
                <li key={id} className="card">
                  {/* делаем кликабельной всю картинку */}
                  <Link href={`/hero/${id}`} prefetch={false} className="block">
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                      <LazyImage
                        wrapperClassName="w-full h-full"
                        className="rounded-xl"
                        src={`/api/images/character/${id}?name=${encodeURIComponent(
                          p.name
                        )}`}
                        alt={p.name}
                      />
                    </div>
                  </Link>

                  <div className="mt-3 flex items-center justify-between">
                    <strong className="text-lg truncate max-w-[70%]">
                      {p.name}
                    </strong>
                  </div>
                </li>
              );
            })}
      </Grid>

      {/* Сентинел ВСЕГДА в DOM, даже во время скелетов */}
      <div ref={sentinelRef} className="h-8" />

      {isFetchingNextPage && (
        <p className="mt-2 text-center text-sm opacity-70">Loading…</p>
      )}
      {!hasNextPage && hasAnyData && (
        <p className="mt-2 text-center text-sm opacity-70">No more heroes.</p>
      )}
    </>
  );
}
