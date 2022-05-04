import type { App, Plugin } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowPointer,
  faGaugeHigh,
  faPlay,
  faPause,
  faHome,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faArrowPointer,
  faGaugeHigh,
  faPlay,
  faPause,
  faHome,
  faArrowRotateLeft
);

export const FontAwesome: Plugin = {
  install(app: App) {
    app.component("fa-icon", FontAwesomeIcon);
  },
};
