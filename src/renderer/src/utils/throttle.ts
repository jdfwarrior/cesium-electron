export function throttle(cb: (args: unknown[]) => void, delay: number) {
  let wait = false;

  return (...args: unknown[]) => {
    if (wait) {
      return;
    }

    cb(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay);
  };
}
