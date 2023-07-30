export function debounce<T extends Function>(func: T, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(null, args)
    }, timeout)
  }
}
