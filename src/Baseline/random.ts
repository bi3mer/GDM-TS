
import { Graph } from '../Graph/graph';
import { createRandomPolicy } from '../util';
import type { Policy } from '../policy';

export function random_policy(G: Graph): Policy {
  return createRandomPolicy(G);
}

