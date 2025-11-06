import { memo } from "react";
import { Handle, Position } from "reactflow";

type Props = { data: { title: string } };

function FilmNode({ data }: Props) {
  return (
    <div className="rounded-xl border px-3 py-2 bg-white shadow text-sm">
      <div className="font-medium">🎬 {data.title}</div>

      {/* ВХОД из героя */}
      <Handle type="target" id="in" position={Position.Left} />
      {/* при желании можно и выход добавить */}
      <Handle type="source" id="out" position={Position.Right} />
    </div>
  );
}

export default memo(FilmNode);
