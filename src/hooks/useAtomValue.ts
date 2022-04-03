import { useEffect, useState } from "react";

import atoms from "../atoms/atoms";
import DefaultValue from "../types/DefaultValue";

function useAtomValue<T = unknown>(
  atomId: string,
  defaultValue?: DefaultValue<T>
): T {
  const atomRef = atoms.get<T>(atomId);

  useEffect(() => {
    (async () => {
      if (defaultValue === undefined) {
        return;
      }
      const value = await (defaultValue instanceof Function
        ? defaultValue()
        : defaultValue);
      if (atomRef.current !== value) {
        atomRef.current = value;
        atoms.notify(atomId);
      }
    })();
  }, [atomId]);

  const [atom, setAtom] = useState<T>(atomRef.current);

  useEffect(() => {
    const clear = atoms.listenAtom(atomId, () => {
      setAtom(atomRef.current);
    });
    return () => {
      clear();
    };
  }, [atomId]);

  return atom;
}

export default useAtomValue;
