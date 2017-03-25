import VueRouter  from 'vue-router';
import AppView from '../App.vue';

const routeMap = [
  {
    path: '/',
    component: AppView,
  }
];

const router = new VueRouter({
  routes: routeMap,
});


export default router;