export enum HistoryMutationType {
  Insert,
  Delete,
  Backspace,
  Drag,
  Drop,
}

export interface HistoryMutation {
  type: HistoryMutationType;
  sub?: HistoryMutation;
  cursor: number;
  text: string;
}