import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Characters.vue";
import Wishlist from "../views/Wishlist.vue";
import WishSpawnCalculator from "../views/WishSpawnCalculator.vue";
import About from "../views/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/wishlist", component: Wishlist },
  { path: "/wishspawn", component: WishSpawnCalculator },
  { path: "/about", component: About },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
