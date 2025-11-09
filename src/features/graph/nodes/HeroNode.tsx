import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Props } from "@/features/types/types";

// Custom nodes
const HeroNode = ({ data }: Props) => {
  return (
    <div className="rounded-xl border px-3 py-2 bg-white shadow text-sm">
      <div className="font-semibold text-red-500">🧑 {data.name}</div>

      <Handle type="source" id="out" position={Position.Right} />
    </div>
  );
};

export default memo(HeroNode);
