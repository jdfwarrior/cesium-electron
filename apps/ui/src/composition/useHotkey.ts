import { onMounted, onUnmounted } from "vue";

interface KeyCombo {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  key: string;
}

export const useHotkey = (combo: string, callback: Function) => {
  const combos: KeyCombo[] = [];

  const parse = (comboStr: string) => {
    const keys = comboStr.toLowerCase().split("+");

    if (keys.length <= 1) return;

    const ctrlKey = /(Ctrl|Control)/i.test(comboStr);
    const shiftKey = /(Shift)/i.test(comboStr);
    const altKey = /(Alt)/i.test(comboStr);
    const key = keys.pop()?.trim();

    if (!key) return;

    combos.push({ ctrlKey, shiftKey, altKey, key });
  };

  parse(combo);

  const keyHandler = (event: KeyboardEvent) => {
    if (combos.length === 1) {
      const [combo] = combos;
      const key = event.key.toLowerCase();

      if (
        combo.ctrlKey === event.ctrlKey &&
        combo.shiftKey === event.shiftKey &&
        combo.altKey === event.altKey &&
        combo.key === key
      )
        callback();
    }
  };

  onMounted(() => {
    document.addEventListener("keydown", keyHandler);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", keyHandler);
  });
};
