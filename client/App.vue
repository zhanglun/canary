<style lang="less">

</style>
<template>
  <h1>Hello, App!!</h1>
</template>
<script>
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

    }
  }
</script>