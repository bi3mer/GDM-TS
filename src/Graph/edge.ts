export class Edge {
  constructor(
    public src: string,
    public tgt: string,
    public probability: Array<[string, number]>,
  ) {}
}
