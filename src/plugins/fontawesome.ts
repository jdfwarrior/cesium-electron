import type { App, Plugin } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowPointer,
  faGaugeHigh,
  faPlay,
  faPause,
  faHome,
  faArrowRotateLeft,
  faTrashCan,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faArrowPointer,
  faGaugeHigh,
  faPlay,
  faPause,
  faHome,
  faArrowRotateLeft,
  faTrashCan,
  faLock
);

export const FontAwesome: Plugin = {
  install(app: App) {
    app.component("fa-icon", FontAwesomeIcon);
  },
};
