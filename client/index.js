import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './routers';

Vue.use(VueRouter);


const app = new Vue({
  router,
}).$mount('#app');
