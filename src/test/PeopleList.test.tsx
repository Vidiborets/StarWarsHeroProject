import * as React from "react";
import { render } from "@testing-library/react";
import PeopleList from "@/features/people/components/PeopleList";
import type { Person } from "@/features/types/types";
import { triggerInView } from "../../jest.setup";

// Mock HeroCard and CardSkeleton to keep DOM minimal & deterministic
jest.mock("@/features/people/components/HeroCard", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  type Props = { p: import("@/features/types/types").Person };
  const Stub = ({ p }: Props) => <li role="listitem">{p.name}</li>;
  return { __esModule: true, default: Stub };
});

jest.mock("@/components/Skeleton", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  const CardSkeleton = () => <li role="listitem">skeleton</li>;
  return { __esModule: true, CardSkeleton };
});

// ---- Mock for usePeopleInfinite ----
type HookResult = {
  data:
    | {
        pages: Array<{
          results: Person[];
        }>;
      }
    | undefined;
  isLoading: boolean;
  isPending: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: jest.Mock<void, []>;
  isError: boolean;
};

let mockState: HookResult;

jest.mock("@/features/people/api/queries", () => ({
  usePeopleInfinite: () => mockState,
}));

// helpers (camelCase поля под новый Person)
const makePerson = (id: number, name: string): Person => ({
  id,
  name,
  height: "180",
  mass: "80",
  hairColor: "brown",
  skinColor: "light",
  eyeColor: "blue",
  birthYear: "50BBY",
  gender: "male",
  homeworld: 1,
  films: [1, 2],
  species: [1],
  starships: [],
  vehicles: [],
});

describe("PeopleList", () => {
  beforeEach(() => {
    mockState = {
      data: undefined,
      isLoading: false,
      isPending: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      isError: false,
    };
  });

  it("renders 12 skeleton cards while initially loading with no data", () => {
    mockState.isLoading = true;
    mockState.isPending = true;
    mockState.data = undefined;

    const { getAllByRole } = render(<PeopleList />);

    const items = getAllByRole("listitem");
    expect(items).toHaveLength(12);
    expect(
      items.every(
        (li: { textContent: string }) => li.textContent === "skeleton"
      )
    ).toBe(true);
  });

  it("renders hero cards when data is available", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke"), makePerson(2, "Vader")] }],
    };

    const { getAllByRole } = render(<PeopleList />);

    const items = getAllByRole("listitem");
    expect(items.map((n: { textContent: string }) => n.textContent)).toEqual([
      "Luke",
      "Vader",
    ]);
  });

  it("shows error block if isError is true", () => {
    mockState.isError = true;

    const { getByText } = render(<PeopleList />);

    expect(getByText(/Failed to load heroes\./i)).toBeInTheDocument();
  });

  it("shows 'Loading…' when fetching next page", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = true;

    const { getByText } = render(<PeopleList />);

    expect(getByText(/Loading…/i)).toBeInTheDocument();
  });

  it("shows 'No more heroes.' when there is data and no next page", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = false;
    mockState.isFetchingNextPage = false;

    const { getByText } = render(<PeopleList />);

    expect(getByText(/No more heroes\./i)).toBeInTheDocument();
  });

  it("calls fetchNextPage when sentinel becomes visible and next page is available", async () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = false;

    render(<PeopleList />);

    await React.act(async () => {
      triggerInView(true);
    });

    expect(mockState.fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("does NOT call fetchNextPage when sentinel is not in view", async () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = false;

    render(<PeopleList />);

    await React.act(async () => {
      triggerInView(false);
    });

    expect(mockState.fetchNextPage).not.toHaveBeenCalled();
  });

  it("does NOT call fetchNextPage if already fetching", async () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = true;

    render(<PeopleList />);

    await React.act(async () => {
      triggerInView(true);
    });

    expect(mockState.fetchNextPage).not.toHaveBeenCalled();
  });
});
