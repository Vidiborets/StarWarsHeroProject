import { WikiPage } from "@/features/types/types";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const UA = "SWGraph/1.0 (https://example.com)";
const TIMEOUT_MS = 800;

// This route was created because the standard endpoint for images does not work.
// If an image is not found on the main resource,
// we take it from the Fandom website or substitute a standard placeholder.

// Function for response timeout
const withTimeout = (
  url: string,
  init?: RequestInit,
  ms: number = TIMEOUT_MS
) => {
  // Create controller for abort time out
  const controller = new AbortController();
  const time = setTimeout(() => controller.abort(), ms);
  // Return promise
  return fetch(url, { ...init, signal: controller.signal }).finally(() =>
    // Clear timeout
    clearTimeout(time)
  );
};

// Function for create header response
const cacheHeaders = (contentType: string) => {
  return {
    "content-type": contentType,
    "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
  };
};

// Create stream responce image
// TODO maybe use RxJs
const streamImage = async (url: string, headers?: HeadersInit) => {
  // Safe construction
  try {
    const res = await withTimeout(url, { redirect: "follow", headers });
    const contentType = res.headers.get("content-type") || "";
    // Response not equal 'image' return null
    if (!res.ok || !contentType.startsWith("image")) return null;
    // Return response
    return new NextResponse(res.body, {
      status: 200,
      headers: cacheHeaders(contentType),
    });
  } catch {
    return null;
  }
};

// Return standart placeholder if image not found
const placeholderResponse = async () => {
  try {
    const fp = path.join(process.cwd(), "public", "placeholder-character.png");
    const buf = await readFile(fp);
    return new NextResponse(buf, {
      status: 200,
      headers: cacheHeaders("image/png"),
    });
  } catch {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="sans-serif" font-size="20" fill="#6b7280">No image</text>
    </svg>`;
    return new NextResponse(svg, {
      status: 200,
      headers: cacheHeaders("image/svg+xml"),
    });
  }
};

// Function for return thumbnail use string response
const getFandomThumbByTitle = async (title: string): Promise<string | null> => {
  const api = `https://starwars.fandom.com/api.php?action=query&format=json&origin=*&prop=pageimages&pithumbsize=800&titles=${encodeURIComponent(
    title
  )}`;
  try {
    const res = await withTimeout(api, {
      headers: { "user-agent": UA, accept: "application/json" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    const first = Object.values(pages)[0] as WikiPage;
    const src: string | undefined = first?.thumbnail?.source;
    return src || null;
  } catch {
    return null;
  }
};

// Function for search in Starwars endpoint (seach by query)
const getFandomThumbBySearch = async (
  query: string
): Promise<string | null> => {
  const searchApi = `https://starwars.fandom.com/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
    query
  )}&srlimit=1`;
  try {
    const res = await withTimeout(searchApi, {
      headers: { "user-agent": UA, accept: "application/json" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data?.query?.search?.[0];
    const pageid: number | undefined = hit?.pageid;
    if (!pageid) return null;

    const pageImgApi = `https://starwars.fandom.com/api.php?action=query&format=json&origin=*&prop=pageimages&pithumbsize=800&pageids=${pageid}`;
    const r2 = await withTimeout(pageImgApi, {
      headers: { "user-agent": UA, accept: "application/json" },
      redirect: "follow",
    });
    if (!r2.ok) return null;
    const d2 = await r2.json();
    const pages = d2?.query?.pages;
    const page = pages?.[pageid];
    const src: string | undefined = page?.thumbnail?.source;
    return src || null;
  } catch {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = (url.searchParams.get("name") || "").trim();

  if (name) {
    const fandomTitle = name.replace(/\s+/g, "_");
    const f1 = await getFandomThumbByTitle(fandomTitle);
    if (f1) {
      const resp = await streamImage(f1, { "user-agent": UA });
      if (resp) return resp;
    }

    const f2 = await getFandomThumbBySearch(name);
    if (f2) {
      const resp = await streamImage(f2, { "user-agent": UA });
      if (resp) return resp;
    }
  }

  return await placeholderResponse();
}
