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
  const q = usePeopleInfinite();

  // не создаём новый массив на каждый рендер
  const people = useMemo(
    () => q.data?.pages.flatMap((p) => p.results) ?? [],
    [q.data]
  );

  // держим отрисованный список, чтобы не мигало
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

  const showInitialSkeleton = !hasAnyData && (q.isLoading || q.isPending);

  // --- наблюдаем «в поле зрения» отдельно в состоянии ---
  const [inView, setInView] = useState(false);

  // ВАЖНО: вешаем IO тогда, когда сентинел УЖЕ в DOM.
  // Для простоты повторно инициализируем, когда меняется people.length (первая загрузка).
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "100px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [people.length]); // при появлении первых данных эффект точно подвесит наблюдатель

  // Триггерим фетч на смену любого флага
  useEffect(() => {
    if (inView && q.hasNextPage && !q.isFetchingNextPage) {
      q.fetchNextPage();
    }
  }, [inView, q.hasNextPage, q.isFetchingNextPage, q.fetchNextPage]);

  if (q.isError) {
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
                  <div className="mt-3 flex items-center justify-between">
                    <strong className="text-lg truncate max-w-[70%]">
                      {p.name}
                    </strong>
                    <Link className="btn" href={`/hero/${id}`}>
                      Open
                    </Link>
                  </div>
                </li>
              );
            })}
      </Grid>

      {/* Сентинел ВСЕГДА в DOM, даже во время скелетов */}
      <div ref={sentinelRef} className="h-8" />

      {q.isFetchingNextPage && (
        <p className="mt-2 text-center text-sm opacity-70">Loading…</p>
      )}
      {!q.hasNextPage && hasAnyData && (
        <p className="mt-2 text-center text-sm opacity-70">No more heroes.</p>
      )}
    </>
  );
}
