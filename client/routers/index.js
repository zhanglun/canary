import VueRouter  from 'vue-router';
import AppView from '../App.vue';

const routes = [
  { path: '/', component: AppView },
]

const router = new VueRouter({
  routes,
});

export default router;
