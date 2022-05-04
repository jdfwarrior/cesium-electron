import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesome } from "./plugins/fontawesome";
import App from "./App.vue";
import "../node_modules/cesium/Source/Widgets/widgets.css";
import "./assets/base.css";
window.CESIUM_BASE_URL = "./";

const app = createApp(App);

app.use(createPinia());
app.use(FontAwesome);

app.mount("#app");
