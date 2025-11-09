import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Props } from "@/features/types/types";

// Custom nodes
const FilmNode = ({ data }: Props) => {
  return (
    <div className="rounded-xl border px-3 py-2 bg-white shadow text-sm">
      <div className="font-medium text-gray-700">🎬 {data.title}</div>

      <Handle type="target" id="in" position={Position.Left} />
      <Handle type="source" id="out" position={Position.Right} />
    </div>
  );
};

export default memo(FilmNode);
