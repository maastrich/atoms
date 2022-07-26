import { useCallback, useState } from "react";

function useRevision(): () => void {
  const [, setValue] = useState(0);
  return useCallback(() => setValue((value) => value + 1), []);
}

export default useRevision;
