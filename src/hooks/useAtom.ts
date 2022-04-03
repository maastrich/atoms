import Atom from "../types/Atom";
import DefaultValue from "../types/DefaultValue";

import useAtomValue from "./useAtomValue";
import useClearAtom from "./useClearAtom";
import useSetAtom from "./useSetAtom";

function useAtom<T = unknown>(
  atomId: string,
  defaultValue?: DefaultValue<T>
): Atom<T> {
  const atom = useAtomValue<T>(atomId, defaultValue);
  const setAtom = useSetAtom<T>(atomId);
  const clear = useClearAtom(atomId);

  return [atom, setAtom, clear] as Atom<T>;
}

export default useAtom;
