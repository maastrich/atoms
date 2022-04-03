import { useEffect, useState } from "react";

import atoms from "../atoms/atoms";
import DefaultValue from "../types/DefaultValue";

function useAtomValue<T>(
  atomId: string,
  defaultValue?: DefaultValue<T>
): [atom: T, mounted: boolean] {
  const atomRef = atoms.get<T>(atomId);
  const [mounted, setMounted] = useState(atoms.isAtomMounted(atomId));
  const [atom, setAtom] = useState<T>(atomRef.current);

  useEffect(() => {
    if (mounted) {
      return;
    }
    if (defaultValue === undefined) {
      setMounted(true);
      return;
    }
    (async () => {
      const value = await (defaultValue instanceof Function
        ? defaultValue()
        : defaultValue);
      if (atomRef.current !== value) {
        atomRef.current = value;
        atoms.notify(atomId);
      }
      setMounted(true);
    })();
  }, [atomId]);

  useEffect(() => {
    atoms.setAtomMounted(atomId);
  }, [mounted]);

  useEffect(() => {
    const clear = atoms.listenAtom(atomId, () => {
      setAtom(atomRef.current);
    });
    return () => {
      clear();
    };
  }, [atomId]);

  return [atom, mounted];
}

export default useAtomValue;
