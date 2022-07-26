import { MutableRefObject, useMemo } from "react";

import atoms from "./atoms";

function useAtomRef<T = unknown>(atomId: string): MutableRefObject<T> {
  return useMemo(() => atoms.get<T>(atomId), [atomId]);
}

export default useAtomRef;
