import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (mainFunction: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null;

  const debouncedFunction = function (...args: any[]): void {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };

  debouncedFunction.cancel = (): void => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return debouncedFunction;
};
