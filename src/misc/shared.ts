import { useState, useEffect } from "react";

export function shared<T>(defaultValue: T) {
  let currentValue = defaultValue;
  const setters: Array<React.Dispatch<React.SetStateAction<T>>> = [];
  const updateFunction = (newValue: T) => {
    if (currentValue === newValue) return;
    currentValue = newValue;
    setters.forEach((s) => s(newValue));
  };
  const ret: [() => [T, (value: T) => void], (value: T) => void] = [
    (): [T, (value: T) => void] => {
      const set = useState(currentValue)[1];

      useEffect(() => {
        if (setters.indexOf(set) === -1) {
          setters.push(set);
        }

        return () => {
          const setterIdx = setters.indexOf(set);
          setters.splice(setterIdx, 1);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return [currentValue, updateFunction];
    },
    updateFunction,
  ];
  return ret;
}
