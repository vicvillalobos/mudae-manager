import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Characters.vue";
import Tiers from "../views/Tiers.vue";
import Wishlist from "../views/Wishlist.vue";
import WishSpawnCalculator from "../views/WishSpawnCalculator.vue";
import About from "../views/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/tiers", component: Tiers },
  { path: "/wishlist", component: Wishlist },
  { path: "/wishspawn", component: WishSpawnCalculator },
  { path: "/about", component: About },
];

const history = createWebHashHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
