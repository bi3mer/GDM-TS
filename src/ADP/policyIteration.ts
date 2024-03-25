
import { Graph } from "../Graph/graph";
import type { Policy } from "../policy";
import { calculateUtility, calculateMaxUtility, createRandomPolicy, resetUtility } from "../util";


function modified_in_place_policy_evaluation(G: Graph, pi: Policy, gamma: number, policy_k: number): void {
  for (let __ = 0; __ < policy_k; __++) {
    for (const n in G.nodes) {
      const node = G.get_node(n);
      if (node.is_terminal) {
        continue;
      }
      node.utility = calculateUtility(G, n, pi[n], gamma);
    }
  }
}

function modified_policy_evaluation(G: Graph, pi: Policy, gamma: number, policy_k: number): void {
  for (let __ = 0; __ < policy_k; __++) {
    const u_temp: Record<string, number> = {};
    for (const n in G.nodes) {
      if (G.get_node(n).is_terminal) {
        continue;
      }
      u_temp[n] = calculateUtility(G, n, pi[n], gamma);
    }
    G.set_node_utilities(u_temp);
  }
}

function in_place_policy_evaluation(G: Graph, _: any, gamma: number, policy_k: number): void {
  for (let __ = 0; __ < policy_k; __++) {
    for (const n in G.nodes) {
      G.get_node(n).utility = calculateMaxUtility(G, n, gamma);
    }
  }
}

function policy_evaluation(G: Graph, _: any, gamma: number, policy_k: number): void {
  for (let i = 0; i < policy_k; i++) {
    const u_temp: { [key: string]: number } = {};
    for (const n in G.nodes) {
      u_temp[n] = calculateMaxUtility(G, n, gamma);
    }
    G.set_node_utilities(u_temp);
  }
}

function policy_improvement(G: Graph, pi: Policy, gamma: number): boolean {
  let changed = false;
  for (const n in G.nodes) {
    if (G.get_node(n).is_terminal) {
      continue;
    }
    let best_s: string | null = null;
    let best_u = -Infinity;
    for (const n_p of G.neighbors(n)) {
      const u_p = calculateUtility(G, n, n_p, gamma);
      if (u_p > best_u) {
        best_s = n_p;
        best_u = u_p;
      }
    }
    if (pi[n] !== best_s) {
      pi[n] = best_s;
      changed = true;
    }
  }
  return changed;
}

function policy_iteration(G: Graph, gamma: number, modified: boolean = false, in_place: boolean = false, policy_k: number = 10, should_reset_utility: boolean = true): Policy {
  if (should_reset_utility) {
    resetUtility(G);
  }

  const pi: Policy = createRandomPolicy(G);

  let policy_eval: (G: Graph, pi: Policy, gamma: number, policy_k: number) => void;

  if (modified && in_place) {
    policy_eval = modified_in_place_policy_evaluation;
  } else if (modified && !in_place) {
    policy_eval = modified_policy_evaluation;
  } else if (!modified && in_place) {
    policy_eval = in_place_policy_evaluation;
  } else {
    policy_eval = policy_evaluation;
  }

  while (true) {
    policy_eval(G, pi, gamma, policy_k);
    if (!policy_improvement(G, pi, gamma)) {
      break;
    }
  }
  policy_eval(G, pi, gamma, policy_k);
  policy_improvement(G, pi, gamma);
  return pi;
}

