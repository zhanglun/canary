import VueRouter from 'vue-router';
import AppView from '../app.vue';
import LianjiaView from '../pages/lianjia/index.vue';

const routes = [
  {
    path: '/',
    component: AppView,
  },
  {
    path: '/lianjia',
    component: LianjiaView,
  }
];

const router = new VueRouter({
  routes,
});

export default router;
