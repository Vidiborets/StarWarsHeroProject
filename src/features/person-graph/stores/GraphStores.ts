import { makeAutoObservable, observable } from "mobx";
import type { Edge, Node } from "reactflow";
import type { Film, Person, Starship } from "@/features/types/types";
import { createHeroEdge } from "@/features/person-graph/utils";

// Class with mobx store to save result response
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

  // Custom create nodes
  buildGraph(person: Person, films: Film[], ships: Starship[]) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    nodes.push({
      id: `p-${person.id}`,
      type: "hero",
      position: { x: 0, y: 0 },
      data: person,
    });

    for (const film of films) {
      nodes.push({
        id: `f-${film.id}`,
        type: "film",
        position: { x: 0, y: 0 },
        data: film,
      });

      edges.push(
        createHeroEdge({
          personId: person.id,
          targetId: film.id,
          targetType: "f",
        })
      );
    }

    for (const ship of ships) {
      nodes.push({
        id: `s-${ship.id}`,
        type: "ship",
        position: { x: 0, y: 0 },
        data: ship,
      });

      edges.push(
        createHeroEdge({
          personId: person.id,
          targetId: ship.id,
          targetType: "s",
        })
      );
    }

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

    this.nodes = nodes;
    this.edges = edges;
  }
}
