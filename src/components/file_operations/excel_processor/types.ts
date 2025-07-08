interface Node {
	id: string;
	type: "input" | "output" | "expression";
	value?: any;
	formula?: string;
}

interface Connection {
	from: string; // Node ID
	to: string; // Node ID
}

interface ProcessorState {
	nodes: Record<string, Node>;
	connections: Connection[];
}

interface ProcessorOptions {
	state?: Partial<ProcessorState>;
	onStateChange?: (next: ProcessorState) => void;
}
