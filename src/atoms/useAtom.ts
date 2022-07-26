import { Atom, DefaultValue } from "../types";

import useAtomValue from "./useAtomValue";
import useClearAtom from "./useClearAtom";
import useSetAtom from "./useSetAtom";

function useAtom<T>(atomId: string, defaultValue?: DefaultValue<T>): Atom<T> {
  const [atom, mounted] = useAtomValue<T>(atomId, defaultValue);
  const setAtom = useSetAtom<T>(atomId);
  const clear = useClearAtom(atomId);

  return [atom, setAtom, clear, mounted];
}

export default useAtom;
