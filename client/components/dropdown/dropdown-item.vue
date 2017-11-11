<style lang="less">

</style>
<template>
  <div class="dropdown-item">
   <slot></slot>
  </div>
</template>
<script>

  export default {
    name: 'dropdown-item',
    mixins: [],
    components: {},
    data() {
      return {};
    },
    watch: {},
    computed: {},
    methods: {},
    mounted(){
      console.log('item');
    },
  }
</script>
