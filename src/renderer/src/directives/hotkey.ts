import type { App, Plugin, DirectiveBinding } from "vue";

interface HotkeyOptions {
  combo: string;
  action: () => void;
}

function parse(combo: string) {
  const ctrlKey = /Ctrl/i.test(combo);
  const shiftKey = /Shift/i.test(combo);

  // replace all instances of ctrl, shift, + and spaces to
  // get the actual key that triggers the action
  const key = combo.replace(/\s+|Ctrl|Shift|\+/gi, "");
  return { ctrlKey, shiftKey, key };
}

export const vHotkey: Plugin = {
  install: (app: App) => {
    const directive = (
      el: HTMLElement,
      binding: DirectiveBinding<HotkeyOptions>
    ) => {
      const combos = binding.value.combo.split(",");
      if (!combos.length) return;
      const [comboStr] = combos;
      const combo = parse(comboStr);

      const currentTitle = el.getAttribute("title");
      let titleWithCombo;

      if (currentTitle) titleWithCombo = `${currentTitle} (${comboStr})`;
      else titleWithCombo = comboStr;

      el.setAttribute("title", titleWithCombo);

      document.body.addEventListener(
        "keydown",
        (event: KeyboardEvent) => {
          if (
            event.ctrlKey === combo.ctrlKey &&
            event.shiftKey === combo.shiftKey &&
            event.key.toLowerCase() === combo.key.toLowerCase()
          )
            binding.value.action();
        },
        true
      );
    };

    app.directive("hotkey", directive);
  },
};
