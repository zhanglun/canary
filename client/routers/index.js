import VueRouter  from 'vue-router';
import AppView from '../app.vue';

const routes = [
  {
    path: '/',
    component: AppView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
