"use client";
import Link from "next/link";
import PeopleList from "@/features/people/components/PeopleList";

export default function HomePage() {
  return (
    <main className="container py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Star Wars Heroes</h1>
        <Link href="/" className="btn">
          Home
        </Link>
      </header>
      <PeopleList />
    </main>
  );
}
