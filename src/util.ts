import { Graph } from "./Graph/graph";
import type { Policy } from "./policy";
import { choice } from "./rand";

export function calculateUtility(G: Graph, src: string, tgt: string, gamma: number): number {
  const P = G.getEdge(src, tgt).probability;
  const size = P.length;
  let sum = 0;

  for (let i = 0; i < size; ++i) {
    const [nTgt, p] = P[i];
    sum += p * (G.reward(nTgt) + gamma * G.utility(nTgt));
  }

  return sum;
}

export function calculateMaxUtility(G: Graph, n: string, gamma: number): number {
  const node = G.get_node(n);
  if (node.is_terminal) {
    return 0;
  }

  const neighbors = node.neighbors;
  const size = neighbors.length;
  let max = -Infinity;

  for (let i = 0; i < size; ++i) {
    max = Math.max(max, calculateUtility(G, n, neighbors[i], gamma));
  }

  return max;
}

export function resetUtility(G: Graph): void {
  for (const n in G.nodes) {
    G.nodes[n].utility = 0;
  }
}

export function createRandomPolicy(G: Graph): Policy {
  const pi: { [n: string]: string } = {};
  for (const n in G.nodes) {
    if (!G.get_node(n).is_terminal) {
      pi[n] = choice(G.neighbors(n));
    }
  }
  return pi;
}

export function createPolicy(G: Graph, gamma: number): Policy {
  const pi: Policy = {};
  for (const n in G.nodes) {
    if (G.get_node(n).is_terminal) {
      continue;
    }

    let best_u = -Infinity;
    let best_n: string = "";

    for (const n_p of G.neighbors(n)) {
      const u = calculateUtility(G, n, n_p, gamma);
      if (u > best_u) {
        best_u = u;
        best_n = n_p;
      }
    }

    pi[n] = best_n;
  }

  return pi;
}

export function runPolicy(G: Graph, start: string, pi: Policy, max_steps: number): [string[], number[]] {
  const states: string[] = [start];
  const rewards: number[] = [G.nodes[start].reward];
  let cur_state = start;
  for (let i = 0; i < max_steps; i++) {
    if (G.nodes[cur_state].is_terminal) {
      break;
    }

    let tgt_state = pi[cur_state];
    let p = Math.random();

    for (const [next_state, probability] of G.getEdge(cur_state, tgt_state).probability) {
      if (p <= probability) {
        tgt_state = next_state;
        break;
      } else {
        p -= probability;
      }
    }

    states.push(tgt_state);
    rewards.push(G.nodes[tgt_state].reward);
    cur_state = tgt_state;
  }

  return [states, rewards];
}

