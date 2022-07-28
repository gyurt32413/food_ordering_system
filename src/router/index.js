import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/store1",
    name: "store-one",
    component: () => import("../views/StoreOne.vue"),
  },
  {
    path: "/store2",
    name: "store-two",
    component: () => import("../views/StoreTwo.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
