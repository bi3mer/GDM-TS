export class Node {
  constructor(
    public name: string,
    public reward: number,
    public utility: number,
    public isTerminal: boolean,
    public neighbors: string[],
  ) {}
}
