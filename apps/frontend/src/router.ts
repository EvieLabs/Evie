import nprogress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve((to, _from, next) => {
  if (to.name) {
    nprogress.start();
  }
  next();
});

router.afterEach(() => {
  nprogress.done();
});

export default router;
