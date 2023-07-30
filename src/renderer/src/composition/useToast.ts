import { ref } from 'vue'

export type ToastType = 'warn' | 'info' | 'success' | 'error'

export interface Toast {
  id: number
  type: ToastType
  text: string
  cancelable: boolean
  onClose?: () => void
  dismissAfter: number
}

export interface ToastOptions {
  cancelable?: boolean
  onClose?: () => void
  dismissAfter?: number
}

const ToastOptionDefaults = {
  cancelable: true,
  onClose: () => {},
  dismissAfter: 0
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  function remove(id: number) {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index >= 0) toasts.value.splice(index, 1)
  }

  function create(type: ToastType, text: string, options: ToastOptions) {
    const mergedOptions = { ...ToastOptionDefaults, ...options }

    const newToast: Toast = {
      id: Date.now(),
      type,
      text,
      cancelable: mergedOptions.cancelable,
      onClose: mergedOptions.onClose,
      dismissAfter: mergedOptions.dismissAfter
    }

    toasts.value.push(newToast)

    if (newToast.dismissAfter > 0) {
      setTimeout(() => remove(newToast.id), newToast.dismissAfter)
    }
  }

  function success(text: string, options: ToastOptions = {}) {
    create('success', text, options)
  }

  function warn(text: string, options: ToastOptions = {}) {
    create('warn', text, options)
  }

  function info(text: string, options: ToastOptions = {}) {
    create('info', text, options)
  }

  function error(text: string, options: ToastOptions = {}) {
    create('error', text, options)
  }

  return {
    success,
    warn,
    info,
    error,
    remove,
    toasts
  }
}
