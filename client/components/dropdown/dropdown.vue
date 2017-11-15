<style lang="less">


</style>
<template>
  <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="trigger" ref="reference" @click="handleTriggerClick">
      <slot></slot>
    </div>
    <transition>
      <base-drop v-show="show" ref="drop"
      :reference="this.$refs.reference">
        <div class="list">
          <slot name="list"></slot>
        </div>
      </base-drop>
    </transition>
  </div>
</template>
<script>
  import BaseDrop from './base-drop.vue';

  export default {
    name: 'dropdown',
    mixins: [],
    components: {
      BaseDrop,
    },
    props: {
      trigger: {
        type: String,
        default: 'hover',
      },
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        show: this.visible,
      };
    },
    watch: {
      visible(update) {
        this.show = update;
      },
      show(update) {
        if (update) {
          this.$refs.drop.update();
        } else {
          this.$refs.drop.destroy();
        }
        // this.$emit('on-visible-change', update);
      },
    },
    computed: {},
    methods: {
      handleTriggerClick() {
        if (this.trigger === 'custom') {
          return false;
        }

        if (this.trigger !== 'click') {
          return false;
        }

        this.show = !this.show;

        console.log(this.show);
      },

      handleMouseEnter() {
        if (this.trigger === 'custom') {
          return false;
        }

        if (this.trigger !== 'hover') {
          return false;
        }

        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          this.show = true;
        }, 250);

      },

      handleMouseLeave() {
        if (this.trigger === 'custom') {
          return false;
        }

        if (this.trigger !== 'hover') {
          return false;
        }

        if (this.timer) {
          clearTimeout(this.timer);

          this.timer = setTimeout(() => {
            this.show = false;
          }, 150);
        }
      },
    },
    mounted() {},
  }

</script>
