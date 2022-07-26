import { useEffect, useState } from "react";

import { AtomState, DefaultValue } from "../types";

import atoms from "./atoms";
import useAtomIsMounting from "./useAtomIsMountingRef";
import useAtomRef from "./useAtomRef";

function useAtomValue<T>(
  atomId: string,
  defaultValue?: DefaultValue<T>
): [atom: T, mounted: boolean] {
  const atomRef = useAtomRef<T>(atomId);
  const mounting = useAtomIsMounting(atomId);
  const [mounted, setMounted] = useState(atoms.isAtomMounted(atomId) ?? false);
  const [atom, setAtom] = useState<T>(atomRef.current);

  useEffect(() => {
    if (mounting.current || mounted) {
      return;
    }
    mounting.current = true;
    if (defaultValue === undefined) {
      atoms.notify(atomId, AtomState.Mounted);
      return;
    }
    if (typeof defaultValue !== "function") {
      atomRef.current = defaultValue;
      atoms.notify(atomId, AtomState.Mounted);
      return;
    }
    (async () => {
      const value = await (defaultValue instanceof Function
        ? defaultValue()
        : defaultValue);
      if (atomRef.current !== value) {
        atomRef.current = value;
        atoms.notify(atomId, AtomState.Mounted);
      }
      setMounted(true);
    })();
  }, [atomId]);

  useEffect(() => {
    if (mounted) {
      atoms.setAtomMounted(atomId);
    }
  }, [mounted]);

  useEffect(() => {
    const clear = atoms.listenAtom(atomId, (state: AtomState) => {
      if (state === AtomState.Mounted) {
        setMounted(true);
      }
      if (state !== AtomState.Mounting) {
        setAtom(atomRef.current);
      }
    });
    return () => {
      clear();
    };
  }, [atomId]);

  return [atom, mounted];
}

export default useAtomValue;
