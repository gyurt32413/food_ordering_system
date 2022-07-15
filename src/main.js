import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");

// https://sheets.googleapis.com/v4/spreadsheets/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/values/50嵐?alt=json&key=AIzaSyAe-zDjqngmdcB2SlOctNzf8RJWuBj--xU
