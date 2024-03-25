
import { Graph } from "../Graph/graph";
import { resetUtility, createPolicy, calculateMaxUtility } from "../util";

export function __in_place_value_iteration(G: Graph, max_iteration: number, gamma: number, theta: number): void {
  for (let k = 0; k < max_iteration; k++) {
    let delta = 0;
    for (const n of G.nodes) {
      const node = G.get_node(n);
      const u = calculateMaxUtility(G, n, gamma);
      delta = Math.max(delta, Math.abs(node.utility - u));
      node.utility = u;
    }
    console.log(`delta=${delta}`);
    if (delta < theta) {
      break;
    }
  }
  console.log(`${max_iteration} iterations to converge.`);
}

export function __value_iteration(G: Graph, max_iteration: number, gamma: number, theta: number): void {
  for (let _ = 0; _ < max_iteration; _++) {
    let delta = 0;
    const u_temp: { [key: string]: number } = {};
    for (const n of G.nodes) {
      const u = calculateMaxUtility(G, n, gamma);
      delta = Math.max(delta, Math.abs(G.utility(n) - u));
      u_temp[n] = u;
    }
    G.set_node_utilities(u_temp);
    if (delta < theta) {
      break;
    }
  }
}

export function value_iteration(
  G: Graph, max_iteration: number, gamma: number, theta: number,
  in_place: boolean = false, should_reset_utility: boolean = true): { [key: string]: string } {
  if (should_reset_utility) {
    resetUtility(G);
  }
  if (in_place) {
    __in_place_value_iteration(G, max_iteration, gamma, theta);
  } else {
    __value_iteration(G, max_iteration, gamma, theta);
  }
  return createPolicy(G, gamma);
}

