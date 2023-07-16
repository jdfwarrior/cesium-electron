import type { App, Plugin, DirectiveBinding } from "vue";
import { useContextMenu } from "@/composition/useContextMenu";
import type { MenuItem } from "@/composition/useContextMenu";

interface ContextBindings {
  event?: "click" | "contextmenu";
  items?: MenuItem[] | ((event: MouseEvent) => MenuItem[]);
  anchor?: string;
}

export const vContext: Plugin = {
  install: (app: App) => {
    const dir = (
      el: HTMLElement,
      binding: DirectiveBinding<ContextBindings>
    ) => {
      const listenFor = binding?.value?.event ?? "contextmenu";
      const anchor = binding.value.anchor ?? "body";

      el.addEventListener(listenFor, (event: MouseEvent) => {
        let menuItems: MenuItem[] = [];

        if (typeof binding.value.items === "function") {
          menuItems = binding.value.items(event);
        } else {
          menuItems = binding.value.items as MenuItem[];
        }

        const menu = useContextMenu();
        menu.open(el, event, menuItems, anchor);
      });
    };
    app.directive("context", dir);
  },
};
