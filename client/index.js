import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

import AppView from './app.vue';
import router from './routers';

import 'vuetify/dist/vuetify.min.css';
// main.js
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(VueRouter);
Vue.use(Vuetify, {
});

/* eslint-disable */
const app = new Vue({
  router,
  render (h) { return h(AppView) }
}).$mount('#app');
