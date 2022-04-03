import Atom from "../types/Atom";
import DefaultValue from "../types/DefaultValue";

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
