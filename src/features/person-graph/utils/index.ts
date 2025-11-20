import { Edge, MarkerType } from "reactflow";

const DEFAULT_EDGE_COLOR = "#94a3b8";

const DEFAULT_EDGE_STYLE: Edge["style"] = {
  strokeWidth: 1.8,
  stroke: DEFAULT_EDGE_COLOR,
};

const DEFAULT_MARKER_END: Edge["markerEnd"] = {
  type: MarkerType.ArrowClosed,
  width: 22,
  height: 22,
  color: DEFAULT_EDGE_COLOR,
};

// Function to create an edge between a hero and a film or ship

export const createHeroEdge = (params: {
  personId: number | undefined;
  targetId: string | number;
  targetType: "f" | "s";
}): Edge => {
  const { personId, targetId, targetType } = params;

  return {
    id: `e-p-${personId}-${targetType}-${targetId}`,
    source: `p-${personId}`,
    target: `${targetType}-${targetId}`,
    sourceHandle: "out",
    targetHandle: "in",
    type: "smoothstep",
    markerEnd: DEFAULT_MARKER_END,
    style: DEFAULT_EDGE_STYLE,
  };
};
