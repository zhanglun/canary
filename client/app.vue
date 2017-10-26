<style lang="less">
  .app {
    background: orange;
  }
</style>
<template>
  <div class="app">
    <h1>Index</h1>
  </div>
</template>
<script>

  export default {
    name: 'App',
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
      console.log(this.message);
    },
  }
</script>
