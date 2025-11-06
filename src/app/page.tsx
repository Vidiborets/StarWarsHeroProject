"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

// Якщо ти вже додав MobX RootStore/PeopleStore — можна імпортувати і використати.
// Поки зробимо просту перевірку Tailwind + рендеру:
export default function HomePage() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // тимчасовий лог, щоб бачити, що клієнтський код працює
    console.log("Home mounted");
  }, []);

  return (
    <main className="container py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Star Wars Heroes</h1>
        <Link href="/" className="btn">
          Home
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="aspect-[3/4] w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
            <div className="mt-3 flex items-center justify-between">
              <strong className="text-lg">Placeholder {i}</strong>
              <button className="btn">Open</button>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-4" />
      <p className="mt-4 text-center text-sm opacity-70">
        Tailwind works if this looks styled ✅
      </p>
    </main>
  );
}
