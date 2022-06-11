import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Claimed.vue";
import Imports from "../views/Import.vue";
import Tiers from "../views/Tiers.vue";
import Wishlist from "../views/Wishlist.vue";
import WishSpawnCalculator from "../views/WishSpawnCalculator.vue";
import About from "../views/About.vue";
import Settings from "../views/Settings.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/import", component: Imports },
  { path: "/tiers", component: Tiers },
  { path: "/wishlist", component: Wishlist },
  { path: "/wishspawn", component: WishSpawnCalculator },
  { path: "/about", component: About },
  { path: "/settings", component: Settings },
];

const history = createWebHashHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
