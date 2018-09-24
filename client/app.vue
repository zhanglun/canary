<style lang="less">
  .v-pagination__item {
    outline: none;
  }
</style>
<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<script>

  export default {
    name: 'app',
    components: {
    },
    data() {
      return {
        message: 'App Created!',
      };
    },
    methods: {

    },
    created() {
    },
  }
</script>
