import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './routers';
import AppView from './app.vue';

Vue.use(VueRouter);

console.log(12323);

const app = new Vue({
  router,
  render (h) { return h(AppView) }
}).$mount('#app');
