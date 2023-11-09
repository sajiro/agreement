/* eslint-disable @typescript-eslint/lines-between-class-members */

import { NodeSelectionType } from "models/node";

export class NodeSelection {
  private mainSelections: Set<string>;
  private descendentSelections: Map<string, Set<string>>;

  constructor() {
    this.mainSelections = new Set<string>();
    this.descendentSelections = new Map<string, Set<string>>();
  }

  isDescendentSelection(id: string) {
    const selectionGroups = Array.from(this.descendentSelections.values());
    for (let i = 0; i < selectionGroups.length; i += 1) {
      if (selectionGroups[i].has(id)) return true;
    }

    return false;
  }

  isMainSelection(id: string) {
    return this.mainSelections.has(id);
  }

  getMainSelections() {
    return Array.from(this.mainSelections.values());
  }

  getSelectionType(id: string) {
    if (this.mainSelections.has(id)) return NodeSelectionType.Main;

    const isDescendentSelection = this.isDescendentSelection(id);
    return isDescendentSelection ? NodeSelectionType.Descendent : undefined;
  }

  addSelection(id: string, descendentIds: Set<string>) {
    if (this.isDescendentSelection(id)) {
      const descendentSelections = Array.from(this.descendentSelections.entries());
      const affectedSelectionKeys = descendentSelections.filter(s => s[1].has(id)).map(s => s[0]);
      affectedSelectionKeys.forEach(k => {
        this.descendentSelections.delete(k);
        this.mainSelections.delete(k);
      });
    }

    descendentIds.forEach(descendentId => {
      if (this.isMainSelection(descendentId)) {
        this.mainSelections.delete(descendentId);
      }
    });

    this.mainSelections.add(id);
    this.descendentSelections.set(id, descendentIds);
  }

  removeSelection(id: string) {
    this.mainSelections.delete(id);
    this.descendentSelections.delete(id);
  }

  clear() {
    this.mainSelections.clear();
    this.descendentSelections.clear();
  }
}