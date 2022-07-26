import { createRef, MutableRefObject } from "react";
import AtomCallback from "../types/AtomCallback";
import AtomState from "../types/AtomState";

class Callbacks {
  private callbacks = new Map<string, MutableRefObject<AtomCallback>>();
  private listeners = new Map<string, Array<(state: AtomState) => void>>();

  private createCallback<Callback extends AtomCallback>(atomId: string): MutableRefObject<Callback> {
    const callbackRef = createRef<Callback>() as MutableRefObject<Callback>;
    this.callbacks.set(atomId, callbackRef);
    return callbackRef;
  }

  public get<Callback extends AtomCallback>(atomId: string): MutableRefObject<Callback> {
    return (this.callbacks.get(atomId) ??
      this.createCallback<Callback>(atomId)) as MutableRefObject<Callback>;
  }

  public notify(atomId: string, state: AtomState): void {
    const listeners = this.listeners.get(atomId);
    if (listeners) {
      listeners.forEach((listener) => listener(state));
    }
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
    this.callbacks.delete(atomId);
    this.listeners.delete(atomId);
  }
}

const callbacks = new Callbacks();

export default callbacks;
