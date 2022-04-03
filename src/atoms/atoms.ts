import { createRef, MutableRefObject } from "react";

class Atoms {
  private atoms = new Map<string, MutableRefObject<unknown>>();
  private listeners = new Map<string, Array<() => void>>();

  public createAtom<T = unknown>(atomId: string): MutableRefObject<T | null> {
    const atomRef = createRef<T>();
    this.atoms.set(atomId, atomRef);
    return atomRef;
  }

  public get<T = unknown>(atomId: string): MutableRefObject<T> {
    return (this.atoms.get(atomId) ??
      this.createAtom<T>(atomId)) as MutableRefObject<T>;
  }

  public notify(atomId: string): void {
    const listeners = this.listeners.get(atomId);
    if (listeners) {
      listeners.forEach((listener) => listener());
    }
  }

  public listenAtom(atomId: string, listener: () => void): () => void {
    const listeners = this.listeners.get(atomId);
    this.listeners.set(atomId, [...(listeners || []), listener]);
    return () => {
      const listeners = this.listeners.get(atomId);
      if (listeners) {
        this.listeners.set(
          atomId,
          listeners.filter((l) => l !== listener)
        );
      }
    };
  }

  public clearAtom(atomId: string): void {
    this.atoms.delete(atomId);
    this.listeners.delete(atomId);
  }
}

const atoms = new Atoms();

export default atoms;
