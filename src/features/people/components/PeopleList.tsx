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
  const ioRef = useRef<HTMLDivElement | null>(null);
  const q = usePeopleInfinite();

  // 1) people мемоизируем по q.data (а не создаём новый массив на каждый рендер)
  const people = useMemo(
    () => q.data?.pages.flatMap((p) => p.results) ?? [],
    [q.data]
  );

  // 2) Держим видимый список в состоянии, но обновляем его только при реальном изменении
  const [visiblePeople, setVisiblePeople] = useState<typeof people>([]);
  const [hasAnyData, setHasAnyData] = useState(false);

  useEffect(() => {
    if (people.length === 0) return;

    // простая проверка «изменилось ли содержимое» (по id)
    const sameLen = visiblePeople.length === people.length;
    const sameItems =
      sameLen &&
      visiblePeople.every((v, i) => ensureId(v) === ensureId(people[i]));

    if (!sameItems) {
      setVisiblePeople(people);
      setHasAnyData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people]); // зависим только от people (visiblePeople учитывать не нужно — мы сравниваем внутри)

  // 3) Скелет показываем только до первой успешной загрузки
  const showInitialSkeleton = !hasAnyData && q.isLoading;

  // 4) IntersectionObserver создаём один раз; читаем актуальные флаги/функцию из ref
  const flagsRef = useRef({
    hasNextPage: !!q.hasNextPage,
    isFetchingNextPage: !!q.isFetchingNextPage,
  });
  const fetchNextRef = useRef(q.fetchNextPage);

  useEffect(() => {
    flagsRef.current = {
      hasNextPage: !!q.hasNextPage,
      isFetchingNextPage: !!q.isFetchingNextPage,
    };
  }, [q.hasNextPage, q.isFetchingNextPage]);

  useEffect(() => {
    fetchNextRef.current = q.fetchNextPage;
  }, [q.fetchNextPage]);

  useEffect(() => {
    const el = ioRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const { hasNextPage, isFetchingNextPage } = flagsRef.current;
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextRef.current();
        }
      },
      { rootMargin: "600px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []); // создаём/удаляем 1 раз

  if (q.isError) {
    return <div className="card text-red-600">Failed to load heroes.</div>;
  }

  if (showInitialSkeleton) {
    return (
      <>
        <Grid>
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </Grid>
        <div className="h-4" />
      </>
    );
  }

  return (
    <>
      <Grid>
        {visiblePeople.map((p) => {
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

      <div ref={ioRef} className="h-8" />
      {q.isFetchingNextPage && (
        <p className="mt-2 text-center text-sm opacity-70">Loading…</p>
      )}
      {!q.hasNextPage && visiblePeople.length > 0 && (
        <p className="mt-2 text-center text-sm opacity-70">No more heroes.</p>
      )}
    </>
  );
}
