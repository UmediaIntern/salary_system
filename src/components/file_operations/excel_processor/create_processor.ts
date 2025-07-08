export class ExcelProcessor {
  private state: ProcessorState;
  private onStateChange?: (next: ProcessorState) => void;

  constructor(initial?: ProcessorOptions) {
    this.state = {
      nodes: {},
      connections: [],
      ...initial?.state,
    };
    this.onStateChange = initial?.onStateChange;
  }

  setOptions(patch: (prev: ProcessorOptions) => ProcessorOptions) {
    const next = patch({ state: this.state, onStateChange: this.onStateChange });
    if (next.state) this.state = next.state as ProcessorState;
    this.onStateChange = next.onStateChange;
  }

  loadExcel(excel: any[][]) {
    excel.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const id = `cell_${rowIndex}_${colIndex}`;
        this.state.nodes[id] = { id, type: "input", value: cell };
      });
    });
    this.triggerUpdate();
  }

  getState() {
    return this.state;
  }

  private triggerUpdate() {
    this.onStateChange?.({ ...this.state });
  }
}

