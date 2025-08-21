export interface ContextMenuBase<T extends string> {
  onAction: (name: T) => void;
}
