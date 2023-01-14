import type { App, Plugin, DirectiveBinding } from "vue";
import { useContextMenu } from "@/composition/useContextMenu";
import type { MenuItem } from "@/composition/useContextMenu";

interface ContextBindings {
  event?: "click" | "contextmenu";
  items?: MenuItem[];
  anchor?: string;
}

export const vContext: Plugin = {
  install: (app: App) => {
    const dir = (
      el: HTMLElement,
      binding: DirectiveBinding<ContextBindings>
    ) => {
      const listenFor = binding?.value?.event ?? "contextmenu";
      const menuItems = binding.value.items ?? [];
      const anchor = binding.value.anchor ?? "body";

      el.addEventListener(listenFor, () => {
        const menu = useContextMenu();
        menu.open(el, menuItems, anchor);
      });
    };
    app.directive("context", dir);
  },
};
