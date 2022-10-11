import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

/* import bootstrap */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faUserSecret,
  faBagShopping,
  faUtensils,
  faArrowUpLong,
} from "@fortawesome/free-solid-svg-icons";

import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(
  faUserSecret,
  faUtensils,
  faCircleXmark,
  faBagShopping,
  faArrowUpLong
);

createApp(App)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
