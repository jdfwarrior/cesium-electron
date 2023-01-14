import type { App, Plugin } from "vue";

export const vDraggable: Plugin = {
  install: (app: App) => {
    const directive = (el: HTMLElement) => {
      const position = { left: 0, top: 0 };
      el.setAttribute("draggable", "true");

      const prevent = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
      };

      const dropHandler = (event: DragEvent) => {
        el.style.right = "";
        el.style.bottom = "";
        el.style.left = event.clientX - position.left + "px";
        el.style.top = event.clientY - position.top + "px";

        document.body.removeEventListener("dragend", prevent);
        document.body.removeEventListener("dragover", prevent);
        document.body.removeEventListener("drop", dropHandler);
      };

      const dragHandler = (event: DragEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();

        position.left = event.clientX - rect.left;
        position.top = event.clientY - rect.top;

        document.body.addEventListener("dragend", prevent);
        document.body.addEventListener("dragover", prevent);
        document.body.addEventListener("drop", dropHandler);
      };

      el.addEventListener("dragstart", dragHandler);
    };

    app.directive("draggable", directive);
  },
};
