# @maastrich/atoms

@maastrich/atoms is an alternative to react Contexts that is expensive in performance.

## Installation

```bash
npm install @maastrich/atoms
```

or

```bash
yarn add @maastrich/atoms
```

## Usage

### `useAtom`

```jsx
import { useAtom } from "@maastrich/atoms";

function MyComponent() {
  /*
   * Creates an atom with id "MyComponent.simple" if it doesn't exist yet with a default value of "initial value".
   * If the atom already exists (created by a parent component of an earlier render of this component),
   * the default value provided will be ignored.
   *
   * The defaultValue is optional.
   *
   * simpleAtom contains the current value of the atom.
   * setSimpleAtom is a function that can be used to update the value of the atom.
   * clearSimpleAtom is a function that can be use to delete the atom, you can use when the component is unmounted.
   *
   * Note: The atom is not persisted between renders if you do not clear it.
   */
  const [simpleAtom, setSimpleAtom, clearSimpleAtom] = useAtom(
    "MyComponent.simple",
    "initial value"
  );

  /*
   * Creates an atom with id "MyComponent.complex"
   * If the default value is a callback, the value will be computed from this callback, if the callback returns a promise,
   * the value will be awaited.
   *
   * If the rendering depends on the async callback, a boolean is provided as the fourth element of the array,
   * it will be true when the promise is fulfilled.
   */
  const [asyncAtom, setAsyncAtom, clearAsyncAtom, asyncAtomMounted] = useAtom(
    "MyComponent.async",
    async () => {
      const response = await fetch("https://api.github.com/users/maastrich");
      return response.json();
    }
  );

  if (!asyncAtomMounted) {
    return (
      <div>
        <div>
          <p>{simpleAtom}</p>
          <button onClick={() => setSimpleAtom((prev) => prev + 1)}></button>
        </div>
        <p>Loading asyncAtom...</p>
      </div>
    );
  }
  return (
    <div>
      <div>
        <p>{simpleAtom}</p>
        <button onClick={() => setSimpleAtom((prev) => prev + 1)}></button>
      </div>
      <p>{asyncAtom}</p>
    </div>
  );
}
```

### `useAtomValue`

> `useAtomValue` has the same prototype as `useAtom`, but it returns the current value and the mounted attribute of the atom instead of the atom itself.
> It is useful when you just need to use the value in a child component or so

```jsx
import { useAtomValue, useAtom } from "@maastrich/atoms";

const [simpleAtom, simpleAtomMounted] = useAtomValue("MyComponent.simple", "initial value");

// is equivalent to

const [simpleAtom, , , simpleAtomMounted] = useAtom("MyComponent.simple", "initial value");
```

### `useSetAtom`

```jsx
import { useSetAtom, useAtom } from "@maastrich/atoms";

const setSimpleAtom = useSetAtom("MyComponent.simple");

// is equivalent to

const [, setSimpleAtom] = useAtom("MyComponent.simple");
```

### `useClearAtom`

```jsx
import { useClearAtom, useAtom } from "@maastrich/atoms";

const clearSimpleAtom = useSetAtom("MyComponent.simple");

// is equivalent to

const [, , clearSimpleAtom] = useAtom("MyComponent.simple");
```
