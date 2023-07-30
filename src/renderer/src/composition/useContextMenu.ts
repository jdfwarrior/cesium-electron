import { reactive, toRefs } from 'vue'

export interface MenuItem {
  id: string
  text: string
  click?: () => void
  disabled?: boolean
  items?: MenuItem[]
}

const state = reactive<{
  show: boolean
  items: MenuItem[]
  anchor: string
  styles: Record<string, string>
}>({
  show: false,
  items: [],
  anchor: 'body',
  styles: {
    left: '0px',
    top: '0px'
  }
})

export const useContextMenu = () => {
  /**
   * Calculate the position of the context menu based on the element and
   * the event that occured.
   * @param ele the element that triggered the contextual menu
   * @param event the event that occured to create the contextual menu
   */
  function _calculate(_: HTMLElement, event: MouseEvent) {
    const height = state.items.length * 25

    const windowHeight = window.innerHeight
    const bottomPosition = event.y + height

    let y = 0

    // if the bottom height exceeds the window height,
    // adjust the y value so that the menu fits within the window
    if (bottomPosition > windowHeight) {
      y = windowHeight - height - 2
    } else {
      y = event.y
    }

    return { x: event.x, y: y }
  }

  /**
   * Wrap the click functions in a wrapper function that will also call
   * the close function when the menu items is clicked. This prevents
   * us from having to listen for clicks on the background of something
   * to know when to close the menu
   * @param items menu items array
   */
  function _wrapClickFunction(items: MenuItem[]) {
    return items.map((item) => ({
      ...item,
      click: () => {
        item?.click?.()
        close()
      }
    }))
  }

  /**
   * Keyboard event handler that watches for the user to press the
   * Escape key and will close the contextual menu if that happens
   * @param event keydown keyboard event
   */
  function closeOnEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close()
    }
  }

  /**
   * Open the contextual menu at the event location and show
   * the provided list of menu items there
   * @param ele the html element that was interacted with
   * @param event the event that triggered the context menu
   * @param items the menu items to show
   * @param anchor the element to anchor the context menu to (default: 'body')
   */
  function open(ele: HTMLElement, event: MouseEvent, items: MenuItem[], anchor: string) {
    state.show = true
    state.anchor = anchor

    const menuItems = _wrapClickFunction(items)
    state.items = menuItems

    const { x, y } = _calculate(ele, event)

    state.styles.left = x + 'px'
    state.styles.top = y + 'px'

    document.body.addEventListener('keydown', closeOnEscape)
  }

  /**
   * Close the contextual menu and reset all values
   */
  function close() {
    state.show = false
    state.items = []
    state.styles.left = '0px'
    state.styles.top = '0px'

    document.body.removeEventListener('keydown', closeOnEscape)
  }

  return {
    open,
    close,
    ...toRefs(state)
  }
}
