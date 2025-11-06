import { makeAutoObservable, observable } from "mobx";
import type { Edge, Node } from "reactflow";
import { MarkerType } from "reactflow";
import type { Film, Person, Starship } from "@/features/types/people.types";

export class GraphStore {
  nodes: Node[] = [];
  edges: Edge[] = [];

  constructor() {
    makeAutoObservable(
      this,
      { nodes: observable.ref, edges: observable.ref },
      { autoBind: true }
    );
  }

  buildGraph(person: Person, films: Film[], ships: Starship[]) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // --- узел героя ---
    nodes.push({
      id: `p-${person.id}`,
      type: "hero",
      position: { x: 0, y: 0 }, // временно, ниже расставим красиво
      data: person,
    });

    // --- фильмы + ребра hero -> film ---
    for (const f of films) {
      nodes.push({
        id: `f-${f.id}`,
        type: "film",
        position: { x: 0, y: 0 },
        data: f,
      });

      edges.push({
        id: `e-p-${person.id}-f-${f.id}`,
        source: `p-${person.id}`,
        target: `f-${f.id}`,
        sourceHandle: "out", // есть на HeroNode
        targetHandle: "in", // есть на FilmNode
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 22,
          height: 22,
          color: "#94a3b8",
        },
        style: { strokeWidth: 1.8, stroke: "#94a3b8" },
      });
    }

    // --- корабли + ребра hero -> ship (можешь потом поменять на film -> ship) ---
    for (const s of ships) {
      nodes.push({
        id: `s-${s.id}`,
        type: "ship",
        position: { x: 0, y: 0 },
        data: s,
      });

      edges.push({
        id: `e-p-${person.id}-s-${s.id}`,
        source: `p-${person.id}`,
        target: `s-${s.id}`,
        sourceHandle: "out", // есть на HeroNode
        targetHandle: "in", // есть на ShipNode
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 22,
          height: 22,
          color: "#94a3b8",
        },
        style: { strokeWidth: 1.8, stroke: "#94a3b8" },
      });
    }

    // --- простая раскладка по слоям, чтобы не лежали стопкой ---
    const GAP_X = 280;
    const GAP_Y = 120;

    const hero = nodes.find((n) => n.id === `p-${person.id}`);
    if (hero) hero.position = { x: 0, y: 0 };

    let i = 0;
    nodes
      .filter((n) => n.type === "film")
      .forEach((n) => {
        n.position = { x: GAP_X, y: i * GAP_Y };
        i++;
      });

    i = 0;
    nodes
      .filter((n) => n.type === "ship")
      .forEach((n) => {
        n.position = { x: GAP_X * 2, y: i * GAP_Y };
        i++;
      });

    // --- одним экшеном в стор ---
    this.nodes = nodes;
    this.edges = edges;
  }
}
