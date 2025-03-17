import { useCallback, useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

export const debounce = (mainFunction: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null;

  const debouncedFunction = function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };

  debouncedFunction.cancel = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return debouncedFunction;
};
