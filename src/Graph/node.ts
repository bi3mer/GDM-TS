export class Node {
  constructor(
    public name: string,
    public reward: number,
    public utility: number,
    public is_terminal: boolean,
    public neighbors: string[],
  ) {}
}
