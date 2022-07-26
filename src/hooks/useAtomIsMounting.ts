import { MutableRefObject, useMemo } from "react";
import atoms from "../atoms/atoms";

function useAtomIsMountingRef(atomId: string): MutableRefObject<boolean> {
  return useMemo(() => atoms.getMountingRef(atomId), [atomId]);
}

export default useAtomIsMountingRef;
