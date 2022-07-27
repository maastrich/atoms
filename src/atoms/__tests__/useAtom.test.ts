import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import useAtom from "../useAtom";

describe("useAtom", () => {
  it("should be defined", () => {
    expect(useAtom).toBeDefined();
  });

  it("should return the atom", () => {
    const { result } = renderHook(() => useAtom("#test.atom", "foo"));
    expect(result.current[0]).toBe(null); // before useEffects
    waitFor(() => {
      expect(result.current[0]).toBe("foo"); // after useEffects
      expect(result.current[1]).toBeInstanceOf(Function);
      expect(result.current[2]).toBeInstanceOf(Function);
      expect(result.current[3]).toBe(true);
    });
  });

  it("should update the atom", () => {
    const { result } = renderHook(() => useAtom("#test.atom"));
    expect(result.current[0]).toBe(null); // before useEffects
    waitFor(() => {
      act(() => {
        result.current[1]("bar");
      });
      expect(result.current[0]).toBe("bar");
    });
  });

  it("should update the atom when it's “brother” is updated", () => {
    const { result: elder } = renderHook(() => useAtom("#test.atom", "bar"));
    const { result: benjamin } = renderHook(() => useAtom("#test.atom"));
    expect(elder.current[0]).toBe(null); // before useEffects
    expect(benjamin.current[0]).toBe(null); // before useEffects
    waitFor(() => {
      expect(elder.current[0]).toBe("bar");
      act(() => {
        benjamin.current[1]("foo");
      });
      expect(elder.current[0]).toBe("foo");
    });
  });

  it("should clean the atom and be unset", () => {
    const { result } = renderHook(() => useAtom("#test.atom", "foo"));
    expect(result.current[0]).toBe(null); // before useEffects
    waitFor(() => {
      expect(result.current[0]).toBe("foo");
      act(() => {
        result.current[2]();
      });
      expect(result.current[0]).toBe(null);
    });
  });
});
