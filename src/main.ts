import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "../node_modules/cesium/Source/Widgets/widgets.css";
import "virtual:windi.css";
window.CESIUM_BASE_URL = "./";

const app = createApp(App);

app.use(createPinia());

app.mount("#app");
