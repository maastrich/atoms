import { MutableRefObject, useMemo } from "react";
import callbacks from "../atoms/callbacks";
import AtomCallback from "../types/AtomCallback";

function useAtomCallbackRef<Callback extends AtomCallback>(atomId: string): MutableRefObject<Callback> {
  return useMemo(() => callbacks.get<Callback>(atomId), [atomId]);
}

export default useAtomCallbackRef;
