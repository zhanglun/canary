import Vue from 'vue';
import VueRouter from 'vue-router';
import AppView from './App.vue';

Vue.use(VueRouter);

const routeMap = [
  {
    path: '/',
    component: AppView,
  }
];

const router = new VueRouter({
  routes: routeMap,
});


console.log('------dff->');


const app = new Vue({
  router,
}).$mount('#app');