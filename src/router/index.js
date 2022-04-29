import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Characters.vue";
import Tiers from "../views/Tiers.vue";
import Wishlist from "../views/Wishlist.vue";
import WishSpawnCalculator from "../views/WishSpawnCalculator.vue";
import About from "../views/About.vue";

const routes = [
  { path: "/mudae-manager/", component: Home },
  { path: "/mudae-manager/tiers", component: Tiers },
  { path: "/mudae-manager/wishlist", component: Wishlist },
  { path: "/mudae-manager/wishspawn", component: WishSpawnCalculator },
  { path: "/mudae-manager/about", component: About },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
