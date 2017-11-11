<style lang="">


</style>
<template>
  <div class="base-dropdown">
    <slot></slot>
  </div>
</template>
<script>
  import popper from 'popper.js';

  export default {
    name: 'base-drop',
    mixins: [],
    components: {},
    data() {
      return {
        popper: null,
      };
    },
    watch: {},
    computed: {},
    methods: {},
    created() {
      this.$on('on-update-base-drop', this.update);
      this.$on('on-destroy-base-drop', this.destroy);
    },
    mounted() {

    },
    beforeDestroy() {
      if (this.popper) {
        this.popper.destroy();
      }
    }
  }

</script>
