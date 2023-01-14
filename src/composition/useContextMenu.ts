import { reactive, toRefs } from "vue";

export interface MenuItem {
  id: string;
  text: string;
  click: () => void;
  disabled: boolean;
}

const state = reactive<{
  show: boolean;
  items: MenuItem[];
  anchor: string;
  styles: Record<string, string>;
}>({
  show: false,
  items: [],
  anchor: "body",
  styles: {
    left: "0px",
    top: "0px",
  },
});

export const useContextMenu = () => {
  function _calculate(ele: HTMLElement) {
    const height = state.items.length * 25;
    const { bottom, left } = ele.getBoundingClientRect();

    const windowHeight = window.innerHeight;
    const bottomPosition = bottom + height;

    let y = 0;

    // if the bottom height exceeds the window height,
    // adjust the y value so that the menu fits within the window
    if (bottomPosition > windowHeight) {
      y = windowHeight - height - 2;
    } else {
      y = bottom;
    }

    return { x: left, y: y };
  }

  function _wrapClickFunction(items: MenuItem[]) {
    return items.map((item) => ({
      ...item,
      click: () => {
        item?.click?.();
        close();
      },
    }));
  }

  function open(ele: HTMLElement, items: MenuItem[], anchor: string) {
    state.show = true;
    state.anchor = anchor;

    const menuItems = _wrapClickFunction(items);
    state.items = menuItems;

    const { x, y } = _calculate(ele);

    state.styles.left = x + "px";
    state.styles.top = y + "px";
  }

  function close() {
    state.show = false;
    state.items = [];
    state.styles.left = "0px";
    state.styles.top = "0px";
  }

  return {
    open,
    close,
    ...toRefs(state),
  };
};
