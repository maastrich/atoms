import { useEffect, useMemo, useRef } from "react";
import callbacks from "../atoms/callbacks";
import AtomCallback from "../types/AtomCallback";
import AtomState from "../types/AtomState";
import useAtomCallbackRef from "./useAtomCallbackRef";
import useRevision from "./useRevision";


function useAtomCallback<Callback extends AtomCallback>(atomId: string, callback?: Callback, deps?: Array<unknown>): Callback {
  const revision = useRevision();
  const mainCallbackRef = useRef(!!callback);
  const callbackRef = useAtomCallbackRef<Callback>(atomId);
  const cb = useMemo(() => {
    if (callback) {
      callbackRef.current = callback;
      callbacks.notify(atomId, AtomState.Updated);
    }
    return callbackRef.current;
  }, deps);

  useEffect(() => {
    const clear = callbacks.listenAtom(atomId, (state: AtomState) => {
      if (state === AtomState.Updated) {
        revision();
      }
    });
    return () => clear();
  }, [])

  useEffect(() => {
    if (mainCallbackRef.current) {
      return () => {
        callbacks.clearAtom(atomId);
      }
    }
  }, [])

  if (!cb) {
    throw new Error(`Callback atom ${atomId} is not defined`);
  }

  return cb;
}

export default useAtomCallback;
