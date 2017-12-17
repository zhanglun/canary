import VueRouter  from 'vue-router';
import AppView from '../app.vue';

import TangoView from '../pages/tango/index.vue';

const routes = [
  {
    path: '/',
    component: AppView,
  },
  {
    path: '/tango',
    component: TangoView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
