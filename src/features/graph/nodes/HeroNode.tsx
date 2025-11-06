import { memo } from "react";
import { Handle, Position } from "reactflow";

type Props = { data: { name: string } };

function HeroNode({ data }: Props) {
  return (
    <div className="rounded-xl border px-3 py-2 bg-white shadow text-sm">
      <div className="font-semibold">🧑 {data.name}</div>

      <Handle type="source" id="out" position={Position.Right} />
    </div>
  );
}

export default memo(HeroNode);
