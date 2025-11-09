import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Props } from "@/features/types/types";

// Custom nodes
const ShipNode = ({ data }: Props) => {
  return (
    <div className="rounded-xl border px-3 py-2 bg-white shadow text-sm">
      <div className="font-medium text-sky-500">🚀 {data.name}</div>

      {/* ВХОД из героя или фильма */}
      <Handle type="target" id="in" position={Position.Left} />
    </div>
  );
};

export default memo(ShipNode);
