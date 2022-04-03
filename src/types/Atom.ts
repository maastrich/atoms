type Atom<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  clear: () => void
];

export default Atom;
