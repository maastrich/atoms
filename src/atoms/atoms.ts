import { createRef, MutableRefObject } from "react";
import AtomState from "../types/AtomState";

class Atoms {
  private atoms = new Map<string, MutableRefObject<unknown>>();
  private listeners = new Map<string, Array<(state: AtomState) => void>>();
  private mounted = new Map<string, boolean>();
  private mounting = new Map<string, MutableRefObject<boolean>>();

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

  public notify(atomId: string, state: AtomState): void {
    const listeners = this.listeners.get(atomId);
    if (listeners) {
      listeners.forEach((listener) => listener(state));
    }
  }

  private createMountingRef(atomId: string): MutableRefObject<boolean | null> {
    const mountingRef = createRef<boolean>() as MutableRefObject<boolean>;
    mountingRef.current = false;
    this.mounting.set(atomId, mountingRef);
    return mountingRef;
  }

  public getMountingRef(atomId: string): MutableRefObject<boolean> {
    return (this.mounting.get(atomId) || this.createMountingRef(atomId)) as MutableRefObject<boolean>;
  }

  public isAtomMounted(atomId: string): boolean {
    return this.mounted.get(atomId) ?? false;
  }

  public setAtomMounted(atomId: string): void {
    this.mounted.set(atomId, true);
  }

  public listenAtom(atomId: string, listener: (
    state: AtomState
  ) => void): () => void {
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
    this.mounted.delete(atomId);
    this.mounting.delete(atomId);
    this.listeners.delete(atomId);
  }
}

const atoms = new Atoms();

export default atoms;
