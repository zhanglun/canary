<style lang="less">
  .app {
    background: orange;
  }
</style>
<template>
  <div class="app">
    <h1>Index</h1>
    <app-header></app-header>
  </div>
</template>
<script>
  import HeaderComponent from './components/Header.vue';

  export default {
    name: 'App',
    data() {
      return {
        message: 'App Created!',
      };
    },
    created() {
      console.log(this.message);
    },
    methods: {

    },
    components: {
      'app-header': HeaderComponent,
    }
  }
</script>
