import * as React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";

jest.mock(require.resolve("../features/api/queries"), () => ({
  __esModule: true,
  usePersonAggregate: (id: number): AggregateResult => mockAggregate,
}));

jest.mock("reactflow", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");

  type RFProps = {
    nodes: unknown[];
    edges: unknown[];
    nodeTypes: Record<string, unknown>;
    children?: React.ReactNode;
    fitView?: boolean;
    fitViewOptions?: unknown;
    defaultEdgeOptions?: unknown;
  };

  const ReactFlow = ({ children }: RFProps) => (
    <div data-testid="reactflow">{children}</div>
  );

  const Background: React.FC = () => <div data-testid="rf-background" />;
  const Controls: React.FC<{ position?: string }> = ({ position }) => (
    <div data-testid="rf-controls" data-position={position} />
  );

  const MarkerType = { ArrowClosed: "ArrowClosed" } as const;

  return {
    __esModule: true,
    default: ReactFlow,
    Background,
    Controls,
    MarkerType,
  };
});

type MockStore = {
  nodes: Array<{ id: string; type?: string }>;
  edges: Array<{ id: string }>;
  buildGraph: jest.Mock<void, [unknown, unknown[], unknown[]]>;
};

const createdStores: MockStore[] = [];

jest.mock(
  require.resolve("../features/person-graph/stores/GraphStores"),
  () => {
    const GraphStore = jest.fn(() => {
      const store: MockStore = {
        nodes: [],
        edges: [],
        buildGraph: jest.fn(),
      };
      createdStores.push(store);
      return store;
    });
    return { __esModule: true, GraphStore };
  }
);

type AggregateData = {
  person: { id: number; name: string };
  films: Array<{ id: number; title: string }>;
  ships: Array<{ id: number; name: string }>;
};

type AggregateResult =
  | { data: undefined; isLoading: true; isError: false }
  | { data: undefined; isLoading: false; isError: true }
  | { data: AggregateData; isLoading: false; isError: false };

let mockAggregate: AggregateResult = {
  data: undefined,
  isLoading: true,
  isError: false,
};

jest.mock(require.resolve("../features/people/api/queries"), () => ({
  __esModule: true,
  usePersonAggregate: (id: number): AggregateResult => mockAggregate,
}));

import PersonGraph from "@/features/person-graph/components/PersonGraph";

describe("PersonGraph", () => {
  beforeEach(() => {
    createdStores.length = 0;
    mockAggregate = { data: undefined, isLoading: true, isError: false };
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    mockAggregate = { data: undefined, isLoading: true, isError: false };
    render(<PersonGraph id={21} />);
    expect(screen.getByText(/Loading…/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockAggregate = { data: undefined, isLoading: false, isError: true };
    render(<PersonGraph id={21} />);
    expect(screen.getByText(/Failed to load details\./i)).toBeInTheDocument();
  });

  it("calls store.buildGraph when data arrives", () => {
    const data: AggregateData = {
      person: { id: 21, name: "Palpatine" },
      films: [{ id: 5, title: "Ep V" }],
      ships: [],
    };
    mockAggregate = { data, isLoading: false, isError: false };

    render(<PersonGraph id={21} />);

    expect(createdStores.length).toBe(1);
    const store = createdStores[0];
    expect(store.buildGraph).toHaveBeenCalledTimes(1);
    expect(store.buildGraph).toHaveBeenCalledWith(
      data.person,
      data.films,
      data.ships
    );
  });

  it("renders ReactFlow (with Background & Controls)", () => {
    mockAggregate = {
      data: { person: { id: 1, name: "Luke" }, films: [], ships: [] },
      isLoading: false,
      isError: false,
    };
    render(<PersonGraph id={1} />);
    expect(screen.getByTestId("reactflow")).toBeInTheDocument();
    expect(screen.getByTestId("rf-background")).toBeInTheDocument();
    expect(screen.getByTestId("rf-controls")).toHaveAttribute(
      "data-position",
      "bottom-right"
    );
  });

  it("shows 'No starships' banner when there are no ship nodes", () => {
    mockAggregate = {
      data: { person: { id: 2, name: "Leia" }, films: [], ships: [] },
      isLoading: false,
      isError: false,
    };
    render(<PersonGraph id={2} />);
    expect(
      screen.getByText(
        /No starships for this character in the available data\./i
      )
    ).toBeInTheDocument();
  });
});
