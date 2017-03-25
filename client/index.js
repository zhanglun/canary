import Vue from 'vue';
import VueRouter from 'vue-router';
import routers from './routers';
import AppView from './App.vue';

Vue.use(VueRouter);

const app = new Vue({
  routers,
}).$mount('#app');