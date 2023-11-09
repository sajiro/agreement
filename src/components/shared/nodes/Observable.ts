import { v1 as uuidv1 } from 'uuid';

interface IObserver {
  id: string;
  onUpdate: () => void;
}

export class Observable {
  private observers: IObserver[];

  constructor() {
    this.observers = [];
  }

  addObserver(onUpdate: () => void): string {
    const id = uuidv1();
    this.observers.push({ id, onUpdate });
    return id;
  }

  removeObserver(id: string) {
    const observerIndex = this.observers.findIndex(o => o.id === id);
    this.observers.splice(observerIndex, 1);
  }

  update() {
    this.observers.forEach(o => o.onUpdate());
  }
}