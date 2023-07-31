import { ref, computed } from 'vue'

const total = ref(0)
const complete = ref(0)
const percent = computed(() => {
  if (total.value === 0) return 0
  const val = complete.value / total.value
  if (val <= 100) return val * 100
  else return 100
})

export const useProgress = () => {
  function setTotal(to: number) {
    total.value = to
  }

  function set(to: number) {
    complete.value = to

    if (percent.value >= 100) setTimeout(() => reset(), 1000)
  }

  function increment(by: number = 1) {
    complete.value += by

    if (percent.value >= 100) setTimeout(() => reset(), 1000)
  }

  function decrement(by: number = 1) {
    complete.value -= by
  }

  function reset() {
    total.value = 0
    complete.value = 0
  }

  return {
    setTotal,
    set,
    increment,
    decrement,
    reset,
    percent
  }
}
