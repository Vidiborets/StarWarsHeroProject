import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const UA = "SWGraph/1.0 (https://example.com)";
const TIMEOUT_MS = 4000;

function withTimeout(url: string, init?: RequestInit, ms = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() =>
    clearTimeout(t)
  );
}

function cacheHeaders(contentType: string) {
  return {
    "content-type": contentType,
    // год + immutable: браузер НЕ будет запрашивать повторно при Back/Forward
    "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
  };
}

async function streamImage(url: string, headers?: HeadersInit) {
  try {
    const res = await withTimeout(url, { redirect: "follow", headers });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.startsWith("image")) return null;
    return new NextResponse(res.body, {
      status: 200,
      headers: cacheHeaders(ct),
    });
  } catch {
    return null;
  }
}

async function placeholderResponse() {
  try {
    const fp = path.join(process.cwd(), "public", "placeholder-character.png");
    const buf = await readFile(fp);
    return new NextResponse(buf, {
      status: 200,
      headers: cacheHeaders("image/png"),
    });
  } catch {
    const svg = `...`;
    return new NextResponse(svg, {
      status: 200,
      headers: cacheHeaders("image/svg+xml"),
    });
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  // await params
  const { id } = await ctx.params;

  const url = new URL(req.url);
  const name = (url.searchParams.get("name") || "").trim();

  // 1) Visual Guide
  const vg = await streamImage(
    `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`
  );
  if (vg) return vg;

  // 2) Wikipedia
  if (name) {
    const title = encodeURIComponent(name);
    try {
      const wp = await withTimeout(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
        {
          headers: { "user-agent": UA, accept: "application/json" },
          redirect: "follow",
        }
      );
      if (wp.ok) {
        const data = await wp.json();
        const src: string | undefined =
          data?.thumbnail?.source || data?.originalimage?.source;
        if (src) {
          const fromWP = await streamImage(src, { "user-agent": UA });
          if (fromWP) return fromWP;
        }
      }
    } catch {}
  }

  // PlaceHolder
  return await placeholderResponse();
}
