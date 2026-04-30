interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface DebouncedFunction<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
  pending: () => boolean;
}

export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true } = options;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCall:
    | {
        args: Parameters<T>;
        invoke: () => ReturnType<T>;
      }
    | undefined;
  let result: ReturnType<T> | undefined;

  function clearPendingState() {
    lastCall = undefined;
  }

  function invoke() {
    if (!lastCall) {
      return result;
    }

    const pendingCall = lastCall;
    clearPendingState();
    result = pendingCall.invoke();
    return result;
  }

  function startTimer() {
    timeoutId = setTimeout(() => {
      timeoutId = undefined;

      if (trailing) {
        invoke();
        return;
      }

      clearPendingState();
    }, delay);
  }

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const shouldInvokeLeading = leading && timeoutId === undefined;

    lastCall = {
      args,
      invoke: () => fn.apply(this, args) as ReturnType<T>,
    };

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    if (shouldInvokeLeading) {
      result = fn.apply(this, args) as ReturnType<T>;
      clearPendingState();
    }

    startTimer();
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    clearPendingState();
  };

  debounced.flush = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      return invoke();
    }

    return result;
  };

  debounced.pending = () => timeoutId !== undefined;

  return debounced;
}
