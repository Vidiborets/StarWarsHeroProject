import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
// We mock the module by absolute alias path (works with your moduleNameMapper).
// Component imports "../api/queries", which resolves to the same file path,
// so this mock will apply.
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

// helpers
const makePerson = (id: number, name: string): Person => ({
  id,
  name,
  height: "180",
  mass: "80",
  hair_color: "brown",
  skin_color: "light",
  eye_color: "blue",
  birth_year: "50BBY",
  gender: "male",
  homeworld: 1,
  films: [1, 2],
  species: [1],
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

    render(<PeopleList />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(12);
    expect(items.every((li) => li.textContent === "skeleton")).toBe(true);
  });

  it("renders hero cards when data is available", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke"), makePerson(2, "Vader")] }],
    };

    render(<PeopleList />);

    const items = screen.getAllByRole("listitem");
    expect(items.map((n) => n.textContent)).toEqual(["Luke", "Vader"]);
  });

  it("shows error block if isError is true", () => {
    mockState.isError = true;

    render(<PeopleList />);

    expect(screen.getByText(/Failed to load heroes\./i)).toBeInTheDocument();
  });

  it("shows 'Loading…' when fetching next page", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = true;

    render(<PeopleList />);

    expect(screen.getByText(/Loading…/i)).toBeInTheDocument();
  });

  it("shows 'No more heroes.' when there is data and no next page", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = false;
    mockState.isFetchingNextPage = false;

    render(<PeopleList />);

    // The component sets hasAnyData=true after it sees people[]
    expect(screen.getByText(/No more heroes\./i)).toBeInTheDocument();
  });

  it("calls fetchNextPage when sentinel becomes visible and next page is available", async () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = false;

    render(<PeopleList />);

    // simulate intersection inside React act
    await React.act(async () => {
      triggerInView(true);
    });

    // wait for useEffect to run and call fetchNextPage
    await waitFor(() => {
      expect(mockState.fetchNextPage).toHaveBeenCalledTimes(1);
    });
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

    // small wait to ensure effect would run if it had to
    await waitFor(() => {
      expect(mockState.fetchNextPage).not.toHaveBeenCalled();
    });
  });

  it("does NOT call fetchNextPage when sentinel is not in view", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = false;

    render(<PeopleList />);

    triggerInView(false);
    expect(mockState.fetchNextPage).not.toHaveBeenCalled();
  });

  it("does NOT call fetchNextPage if already fetching", () => {
    mockState.data = {
      pages: [{ results: [makePerson(1, "Luke")] }],
    };
    mockState.hasNextPage = true;
    mockState.isFetchingNextPage = true;

    render(<PeopleList />);

    triggerInView(true);
    expect(mockState.fetchNextPage).not.toHaveBeenCalled();
  });
});
