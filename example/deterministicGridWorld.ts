import { policyIteration } from "../src/ADP/policyIteration";
import { value_iteration as valueIteration } from "../src/ADP/valueIteration";
import { greedyPolicy } from "../src/Baseline/greedy";
import { randomPolicy } from "../src/Baseline/random";
import { Graph } from "../src/Graph/graph";
import type { Policy } from "../src/policy";
import { runPolicy } from "../src/util";


// |-----|-----|-----|-----|
// |-0.04|-0.04|-0.04| 1.0 |
// |-0.04|XXXXX|-0.04|-1.0 |
// |-0.04|-0.04|-0.04|-0.04|
// |-----|-----|-----|-----|

const R = -0.04
const G = new Graph();

// ---------- Nodes ---------- 
// bot row
G.addDefaultNode('0,0', R, 0, false, []);
G.addDefaultNode('1,0', R, 0, false, []);
G.addDefaultNode('2,0', R, 0, false, []);
G.addDefaultNode('3,0', R, 0, false, []);

// mid row
G.addDefaultNode('0,1', R, 0, false, []);
G.addDefaultNode('2,1', R, 0, false, []);
G.addDefaultNode('3,1', -1, 0, true, []);

// Top row
G.addDefaultNode('0,2', R, 0, false, []);
G.addDefaultNode('1,2', R, 0, false, []);
G.addDefaultNode('2,2', R, 0, false, []);
G.addDefaultNode('3,2', 1, 0, true, []);

// ---------- Edges ---------- 
// bot row
G.addDefaultEdge('0,0', '1,0');
G.addDefaultEdge('0,0', '0,1');
G.addDefaultEdge('1,0', '0,0');
G.addDefaultEdge('1,0', '2,0');
G.addDefaultEdge('2,0', '1,0');
G.addDefaultEdge('2,0', '3,0');
G.addDefaultEdge('2,0', '2,1');
G.addDefaultEdge('3,0', '2,0');
G.addDefaultEdge('3,0', '3,1');

// mid row
G.addDefaultEdge('0,1', '0,0');
G.addDefaultEdge('0,1', '0,2');
G.addDefaultEdge('2,1', '2,2');
G.addDefaultEdge('2,1', '3,1');
G.addDefaultEdge('2,1', '2,0');

// top row
G.addDefaultEdge('0,2', '0,1');
G.addDefaultEdge('0,2', '1,2');
G.addDefaultEdge('1,2', '0,2');
G.addDefaultEdge('1,2', '2,2');
G.addDefaultEdge('2,2', '1,2');
G.addDefaultEdge('2,2', '3,2');
G.addDefaultEdge('2,2', '2,1');

// ---------- Example of Policies ---------- 
function printPolicyResults(policy: Policy, name: string) {
  const [_steps, rewards] = runPolicy(G, '0,0', policy, 10);
  console.log(`${name}: ${rewards.reduce((a, b) => a + b)}`);
}

printPolicyResults(greedyPolicy(G), 'Greedy');
printPolicyResults(randomPolicy(G), 'Random');
printPolicyResults(policyIteration(G, 0.6), 'Policy Iteration');
printPolicyResults(valueIteration(G, 100, 0.8, 0.0000000001), 'Valute Iteration');


