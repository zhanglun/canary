<style lang="">


</style>
<template>
  <div class="base-dropdown">
    <slot></slot>
  </div>
</template>
<script>
  import Popper from 'popper.js';

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
    methods: {
      createPopper() {

        let reference = this.$parent.$refs.reference;
        let poperElem = this.$el;

        let options = {
          placement: 'bottom',
          modifiers: {
            preventOverflow: {
              boundariesElement: 'scrollParent',
            },
          },
        };
        console.log(reference);
        console.log(poperElem);
        console.log(options);
        this.popper = new Popper(reference, poperElem, options);
        // this.popper.onCreate((popper) => {
        //   console.log('this popper created!!!');
        // });
      },
      update() {
        this.popper ? this.popper.update() : this.createPopper();
      },

      destroy() {

      },
    },
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
