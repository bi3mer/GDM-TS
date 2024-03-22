import { Edge } from "./edge";
import { Node } from "./node";

export class Graph {
  nodes: { [key: string]: Node };
  edges: { [key: string]: Edge };

  constructor() {
    this.nodes = {};
    this.edges = {};
  }

  get_node(node_name: string): Node {
    return this.nodes[node_name];
  }

  has_node(node_name: string): boolean {
    return node_name in this.nodes;
  }

  add_node(node: Node) {
    assert(node instanceof Node);
    assert(!(node.name in this.nodes));
    this.nodes[node.name] = node;
  }

  add_default_node(
    node_name: string,
    reward: number = 1.0,
    utility: number = 0.0,
    terminal: boolean = false,
    neighbors: Set<string> | null = null
  ) {
    assert(!(node_name in this.nodes));
    if (neighbors == null) {
      neighbors = new Set<string>();
    }
    this.nodes[node_name] = new Node(node_name, reward, utility, terminal, neighbors);
  }

  remove_node(node_name: string) {
    assert(node_name in this.nodes);
    const edges_to_remove: Edge[] = [];
    for (const e of Object.values(this.edges)) {
      if (e.src == node_name || e.tgt == node_name) {
        edges_to_remove.push(e);
      }

      const probabilities = e.probability;
      let index = -1;
      for (let i = 0; i < probabilities.length; i++) {
        const [name, _] = probabilities[i];
        if (name == node_name) {
          index = i;
          break;
        }
      }
      if (index == -1) {
        continue;
      }

      const p_value = probabilities[index][1];
      probabilities.splice(index, 1);
      const len = probabilities.length;
      const p_value_new = p_value / len;
      e.probability = probabilities.map(([name, p]) => [name, p + p_value_new]);
    }
    for (const e of edges_to_remove) {
      this.remove_edge(e.src, e.tgt);
    }
    delete this.nodes[node_name];
  }

  get_edge(src_name: string, tgt_name: string): Edge {
    return this.edges[`${src_name},${tgt_name}`];
  }

  has_edge(src_name: string, tgt_name: string): boolean {
    return `${src_name},${tgt_name}` in this.edges;
  }

  add_edge(edge: Edge) {
    assert(edge instanceof Edge);
    assert(edge.src in this.nodes);
    assert(edge.tgt in this.nodes);
    assert(!(`${edge.src},${edge.tgt}` in this.edges));
    this.edges[`${edge.src},${edge.tgt}`] = edge;
    const neighbors = this.nodes[edge.src].neighbors;
    if (!neighbors.has(edge.tgt)) {
      neighbors.add(edge.tgt);
    }
  }

  add_default_edge(src_name: string, tgt_name: string, p: [string, number][] | null = null) {
    if (p == null) {
      p = [];
    }
    this.add_edge(new Edge(src_name, tgt_name, p));
  }

  remove_edge(src_node: string, tgt_node: string) {
    assert(src_node in this.nodes);
    assert(tgt_node in this.nodes);
    assert(`${src_node},${tgt_node}` in this.edges);
    this.neighbors(src_node).delete(tgt_node);
    delete this.edges[`${src_node},${tgt_node}`];
  }

  neighbors(node_name: string): Set<string> {
    return this.nodes[node_name].neighbors;
  }

  set_node_utilities(utilities: { [key: string]: number }) {
    for (const [node_name, utility] of Object.entries(utilities)) {
      this.nodes[node_name].utility = utility;
    }
  }

  utility(node_name: string): number {
    return this.nodes[node_name].utility;
  }

  reward(node_name: string): number {
    return this.nodes[node_name].reward;
  }

  is_terminal(node_name: string): boolean {
    return this.nodes[node_name].is_terminal;
  }

  map_nodes(func: (node: Node) => void) {
    for (const n of Object.values(this.nodes)) {
      func(n);
    }
  }

  map_edges(func: (edge: Edge) => void) {
    for (const e of Object.values(this.edges)) {
      func(e);
    }
  }
}


