import { useCallback } from "react";

import { AtomState } from "../types";

import atoms from "./atoms";

function useSetAtom<T = unknown>(
  atomId: string
): (value: T | ((prev: T) => T)) => void {
  const atomRef = atoms.get<T>(atomId);
  return useCallback((value: T | ((prev: T) => T)) => {
    if (atomRef.current !== value) {
      if (!(atomRef.current instanceof Function) && value instanceof Function) {
        atomRef.current = value(atomRef.current);
      } else {
        atomRef.current = value as T;
      }
      atoms.notify(atomId, AtomState.Updated);
    }
  }, []);
}

export default useSetAtom;
