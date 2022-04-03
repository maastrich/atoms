import { createRef, MutableRefObject } from "react";

class Atoms {
  private atoms = new Map<string, MutableRefObject<unknown>>();
  private listeners = new Map<string, Array<() => void>>();
  private mounted = new Map<string, boolean>();

  private createAtom<T = unknown>(atomId: string): MutableRefObject<T | null> {
    const atomRef = createRef<T>();
    this.atoms.set(atomId, atomRef);
    this.mounted.set(atomId, false);
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

  public setAtomMounted(atomId: string): void {
    this.mounted.set(atomId, true);
  }

  public isAtomMounted(atomId: string): boolean {
    return this.mounted.get(atomId) ?? false;
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
    this.mounted.delete(atomId);
  }
}

const atoms = new Atoms();

export default atoms;
