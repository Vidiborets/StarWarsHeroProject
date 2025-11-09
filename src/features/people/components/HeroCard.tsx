import { ensureId } from "@/utils/lib";
import { Person } from "../../types/types";
import Link from "next/link";
import LazyImage from "@/components/LazyImage";

function DataRow({ label, value }: { label: string; value: unknown }) {
  const txt =
    value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <div className="flex items-center gap-1">
      <span className="text-red-500/80 uppercase tracking-wider">{label}:</span>
      <span className="text-red-50/90">{txt}</span>
    </div>
  );
}

function HeroCard({ p }: { p: Person }) {
  const id = ensureId(p);
  return (
    <li
      key={id}
      className="card group relative overflow-hidden rounded-xl bg-neutral-900/40 border border-red-600/20 hover:border-red-500/50 transition">
      {/* clickable area = image */}
      <Link href={`/hero/${id}`} prefetch={false} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
          <LazyImage
            wrapperClassName="w-full h-full"
            className="rounded-xl"
            src={`/api/images/character/${id}?name=${encodeURIComponent(
              p.name
            )}`}
            alt={p.name}
          />

          {/* hover overlay (STAR WARS style) */}
          <div
            className="
              pointer-events-none
              absolute inset-x-0 bottom-0
              translate-y-3 opacity-0
              group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-300 ease-out
            ">
            <div
              className="
                mx-2 mb-2 rounded-lg
                bg-black/70 backdrop-blur
                border border-red-500/40
                shadow-[0_0_20px_rgba(229,9,17,0.35)]
                text-red-50
              ">
              <div className="px-3 pt-2">
                <p className="text-sm font-semibold tracking-wide text-red-400">
                  {p.name}
                </p>
              </div>
              <div className="px-3 pb-2 pt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] leading-5">
                <DataRow label="Height" value={p.height} />
                <DataRow label="Mass" value={p.mass} />
                <DataRow label="Hair" value={p.hair_color} />
                <DataRow label="Skin" value={p.skin_color} />
                <DataRow label="Eyes" value={p.eye_color} />
                <DataRow label="Birth" value={p.birth_year} />
                <DataRow label="Gender" value={p.gender} />
                <DataRow label="Films" value={p.films?.length} />
              </div>

              {/* line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
            </div>
          </div>
        </div>
      </Link>

      {/* title under image  */}
      <div className="mt-3 flex items-center justify-between px-1.5">
        <strong className="text-lg truncate max-w-[70%]">{p.name}</strong>
      </div>
    </li>
  );
}

export default HeroCard;
