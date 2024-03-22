export class Node {
    name: string;
    reward: number;
    utility: number;
    is_terminal: boolean;
    neighbors: Set<string>;

    constructor(name: string, reward: number, utility: number, is_terminal: boolean, neighbors: Set<string>) {
        this.name = name;
        this.reward = reward;
        this.utility = utility;
        this.is_terminal = is_terminal;
        this.neighbors = neighbors;
    }
}


