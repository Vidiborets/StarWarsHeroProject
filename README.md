Star Wars Hero Project

A Next.js app that explores Star Wars characters with a smooth UI, infinite scrolling, and a relationship graph.
The project follows a feature-oriented (“Bulletproof React”) structure, uses React Query for fetching/caching, MobX for local graph state, and React Flow to render a character-films-starships graph.

✨ Features

People list with infinite scroll and skeleton loading

Hero card with hover overlay and lazy image

Person graph (person → films → starships) rendered via React Flow

Modern UI with TailwindCSS

TypeScript everywhere (no any in tests/mocks)

Unit tests with Jest + Testing Library (no live API calls; everything mocked)

🧰 Tech Stack

Runtime / Framework: Next.js 16 (App Router), React 19

State & Data: @tanstack/react-query v5, MobX + mobx-react-lite

Graph UI: reactflow

Styling: Tailwind CSS v4, PostCSS, Autoprefixer, clsx

Validation: zod

Testing: Jest 30, @testing-library/react, @testing-library/jest-dom, jest-environment-jsdom

Tooling: TypeScript 5, ESLint (next config), concurrently, wait-on, open-cli

📦 Project Structure

Feature-first (Bulletproof) layout with domain co-location.

src/
app/
api/images/character/[id]/route.ts # image proxy/route
hero/[id]/page.tsx # person detail page
layout.tsx, page.tsx, provider.tsx # app shell
globals.css # global styles
components/
Header/..., Logo/..., LazyImage.tsx, Skeleton.tsx
config/
env.ts
features/
api/queries.ts # react-query hooks (person, aggregate, etc.)
graph/nodes/ # React Flow custom nodes
FilmNode.tsx, HeroNode.tsx, ShipNode.tsx, index.tsx
people/
api/queries.ts # people list infinite query hooks
components/HeroCard.tsx
components/PeopleList.tsx
person-graph/
components/PersonGraph.tsx
stores/GraphStores.ts # MobX store for graph (nodes/edges)
types/types.ts # Person, Film, Starship, etc.
lib/
http.ts # fetch wrapper
services/
starwars.services.ts # SWAPI calls
stores/
PeopleStore.ts, RootStores.ts # (if/when used globally)
test/
mocks/
LazyImage.tsx # test-only mock
link.tsx # test-only mock for next/link
HeroCard.test.tsx
PeopleList.test.tsx
PersonGraph.test.tsx

Why this structure?

Follows Bulletproof React principles: co-locate UI, hooks, and store per feature, keep shared primitives in components/, domain API hooks in features/_/api, and domain state in features/_/stores.

▶️ Getting Started
Requirements

Node.js >=18

npm (or pnpm/yarn)

Install
npm install

Run in development
npm run dev

This runs:

next dev on http://localhost:3000

automatically opens the browser when ready

Build & run production
npm run build
npm start

⚙️ Environment

src/config/env.ts centralizes env access.
If you later need API base URLs or tokens, add them there and read via process.env.\*.
The current app uses SWAPI via a thin service layer (services/starwars.services.ts) and image route (/api/images/character/[id]).

🧭 Architecture Notes

Data fetching: @tanstack/react-query hooks in features/api/queries.ts and features/people/api/queries.ts.
Caching, loading, and error states are handled declaratively.

Local graph state: GraphStore (MobX) builds React Flow nodes/edges from aggregate person data.

UI: TailwindCSS utility classes; reusable UI like Skeleton and LazyImage.

Routing: App Router pages in src/app/\*.

✅ Testing
Philosophy

Unit tests only (no real API calls).

All network and framework edges are mocked.

Type-safe test code (no any in tests/mocks).

Commands

# Run once

npm test

# Watch mode

npm run test:watch

What’s covered

HeroCard.test.tsx

Renders name in title and overlay

Link href (/hero/{id})

Image src & alt

Attribute labels/values & “—” fallback

Root classes present

PeopleList.test.tsx

Loading skeleton vs populated list

Infinite scroll behavior (IntersectionObserver mocked)

“Loading…” indicator for next page

“No more heroes.” and error state

PersonGraph.test.tsx

Loading & error states

Calls GraphStore.buildGraph(...) once data arrives

Renders React Flow container/background/controls

Ship banner shows/hides based on store.nodes

Key testing details

No real API: hooks are mocked (e.g. usePeopleInfinite, usePersonAggregate).

React Query: tests render under a QueryClientProvider wrapper with a fresh QueryClient (logging off to keep output clean).

Next.js shims:

next/link is mocked with a plain <a> to simplify assertions.

next/image is mocked as a bare <img>.

UI-only mocks:

LazyImage mock forwards alt/src to <img>.

reactflow is mocked with a lightweight container that renders children; MarkerType, Background, Controls are stubbed.

Browser APIs:

IntersectionObserver is mocked; tests use a helper triggerInView(true|false) to simulate sentinel visibility.
State updates are wrapped with act(...) where needed to avoid warnings.

You’ll find these mocks in src/test/mocks/\* and per-test jest.mock(...) sections.
The tests use strict TypeScript types (no any).

🧪 Jest Configuration

Jest 30 + babel-jest for TS/JS/JSX

jsdom environment

Path aliases: @/_ → <root>/src/_

Setup file (jest.setup.ts) includes:

@testing-library/jest-dom

stable mocks for next/link, next/image, LazyImage

IntersectionObserver mock helpers

optional Query Client test utilities (wrapper)

You can keep your single config file:

// jest.config.ts
import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig: Config = {
testEnvironment: "jest-environment-jsdom",
setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
moduleNameMapper: {
"^@/(._)$": "<rootDir>/src/$1",
},
testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],
collectCoverageFrom: [
"src/\*\*/_.{ts,tsx}",
"!src/**/**tests**/**",
"!src/\*\*/index.{ts,tsx}",
],
};

export default createJestConfig(customJestConfig);

🧹 Linting
npm run lint

ESLint v9 with eslint-config-next

Testing-library and jest-dom plugins enabled

🖼️ Screens / UX

People list grid with responsive columns (1/2/3/4) and hover overlay on Hero cards.

Detail page shows React Flow graph with Background and Controls.
If there are no starships for a character, a subtle banner states:
“No starships for this character in the available data.”

🚧 Known Limitations / Next Steps

Current tests focus on unit coverage (pure UI & hook interactions).
You can add MSW for higher-level integration tests if needed.

Add visual regression tests if desired (e.g., Storybook + Chromatic).

Expand graph layout (dagre) and custom node visuals.

📜 License

MIT — feel free to use and adapt.

🙌 Credits

Data via SWAPI

Graph rendering via React Flow

Folder conventions inspired by Bulletproof React

If you want, I can also add a small “Testing utilities” snippet (QueryClient wrapper + IntersectionObserver helpers) into the README or a separate src/test/utils.ts so it’s discoverable for reviewers.
