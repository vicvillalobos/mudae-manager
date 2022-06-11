import { createApp } from "vue";
import mitt from 'mitt'
import App from "./App.vue";
import router from "./router/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const emitter = mitt()

createApp(App)
    .use(router)
    .provide('emitter', emitter)
    .mount("#app");

import "bootstrap/dist/js/bootstrap.js";