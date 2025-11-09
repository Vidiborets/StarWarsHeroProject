"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import PersonGraph from "@/features/person-graph/components/PersonGraph";
import { usePerson } from "@/features/api/queries";

const PersonPage = () => {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const personQ = usePerson(numId);

  return (
    <main className="container py-6 h-[100dvh]">
      <header className="mb-4 flex items-center gap-3">
        <Link href="/" className="btn">
          ← Back
        </Link>
        <h2 className="text-2xl font-semibold">
          {personQ.data?.name ?? `Hero #${numId}`}
        </h2>
      </header>

      <PersonGraph id={numId} />
    </main>
  );
};
export default PersonPage;
