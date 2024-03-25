
import { Graph } from "../Graph/graph";
import type { Policy } from "../policy";
import { calculateUtility, calculateMaxUtility, createRandomPolicy, resetUtility } from "../util";


function modifiedInPlacePolicyEvaluation(G: Graph, pi: Policy, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    for (const n in G.nodes) {
      const node = G.getNode(n);
      if (!node.isTerminal) {
        node.utility = calculateUtility(G, n, pi[n], gamma);
      }
    }
  }
}

function modifiedPolicyEvaluation(G: Graph, pi: Policy, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    const uTemp: Record<string, number> = {};
    for (const n in G.nodes) {
      if (!G.getNode(n).isTerminal) {
        uTemp[n] = calculateUtility(G, n, pi[n], gamma);
      }
    }
    G.setNodeUtilities(uTemp);
  }
}

function inPlacePolicyEvaluation(G: Graph, _: any, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    for (const n in G.nodes) {
      G.getNode(n).utility = calculateMaxUtility(G, n, gamma);
    }
  }
}

function policyEvaluation(G: Graph, _: any, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    const uTemp: { [key: string]: number } = {};
    for (const n in G.nodes) {
      uTemp[n] = calculateMaxUtility(G, n, gamma);
    }
    G.setNodeUtilities(uTemp);
  }
}

function policyImprovement(G: Graph, pi: Policy, gamma: number): boolean {
  let changed = false;
  for (const n in G.nodes) {
    if (G.getNode(n).isTerminal) {
      continue;
    }

    let bestS: string | null = null;
    let bestU = -Infinity;

    for (const np of G.neighbors(n)) {
      const up = calculateUtility(G, n, np, gamma);
      if (up > bestU) {
        bestS = np;
        bestU = up;
      }
    }

    if (pi[n] !== bestS) {
      pi[n] = bestS!;
      changed = true;
    }
  }

  return changed;
}

export function policyIteration(G: Graph, gamma: number, modified: boolean = false, inPlace: boolean = false, policyK: number = 10, shouldResetUtility: boolean = true): Policy {
  if (shouldResetUtility) {
    resetUtility(G);
  }

  const pi: Policy = createRandomPolicy(G);
  let policyEval: (G: Graph, pi: Policy, gamma: number, policyK: number) => void;

  if (modified && inPlace) {
    policyEval = modifiedInPlacePolicyEvaluation;
  } else if (modified && !inPlace) {
    policyEval = modifiedPolicyEvaluation;
  } else if (!modified && inPlace) {
    policyEval = inPlacePolicyEvaluation;
  } else {
    policyEval = policyEvaluation;
  }

  while (true) {
    policyEval(G, pi, gamma, policyK);
    if (!policyImprovement(G, pi, gamma)) {
      break;
    }
  }

  policyEval(G, pi, gamma, policyK);
  policyImprovement(G, pi, gamma);

  return pi;
}

