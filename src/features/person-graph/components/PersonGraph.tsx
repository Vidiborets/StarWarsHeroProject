"use client";
import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { observer } from "mobx-react-lite";
import { usePersonAggregate } from "../api/queries";
import { GraphStore } from "../stores/GraphStores";
import { nodeTypes } from "../../graph/nodes/index";

const PersonGraph = observer(function PersonGraph({ id }: { id: number }) {
  const agg = usePersonAggregate(id);
  const store = useMemo(() => new GraphStore(), []);

  useEffect(() => {
    if (agg.data) {
      store.buildGraph(agg.data.person, agg.data.films, agg.data.ships);
    }
  }, [agg.data, store]);

  if (agg.isLoading) return <p>Loading…</p>;
  if (agg.isError || !agg.data)
    return <p className="text-red-600">Failed to load details.</p>;

  const hasShips = store.nodes.some((n) => n.type === "ship");

  return (
    <div className="relative h-[80vh] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <ReactFlow
        nodes={store.nodes}
        edges={store.edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#94a3b8",
          },
          style: { strokeWidth: 1.8, stroke: "#94a3b8" },
        }}>
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow>

      {!hasShips && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
          <p className="rounded-md bg-white/80 dark:bg-black/50 px-3 py-1 text-sm text-slate-600 dark:text-slate-300 shadow">
            No starships for this character in the available data.
          </p>
        </div>
      )}
    </div>
  );
});

export default PersonGraph;
