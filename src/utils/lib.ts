export function getIdFromUrl(url: string): number {
  const clean = url.endsWith("/") ? url.slice(0, -1) : url;
  const last = clean.split("/").pop();
  if (!last) throw new Error(`Cannot parse id from url: ${url}`);
  return Number(last);
}

export function ensureId(obj: { id?: number; url?: string }): number {
  if (typeof obj.id === "number") return obj.id;
  if (obj.url) return getIdFromUrl(obj.url);
  throw new Error("Object has neither id nor url");
}
