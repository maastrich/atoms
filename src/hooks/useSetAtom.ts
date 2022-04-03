import { useCallback } from "react";

import atoms from "../atoms/atoms";

function useSetAtom<T = unknown>(
  atomId: string
): (value: T | ((prev: T) => T)) => void {
  const atomRef = atoms.get<T>(atomId);
  return useCallback((value: T | ((prev: T) => T)) => {
    if (atomRef.current !== value) {
      if (value instanceof Function) {
        atomRef.current = value(atomRef.current);
      } else {
        atomRef.current = value;
      }
      atoms.notify(atomId);
    }
  }, []);
}

export default useSetAtom;
