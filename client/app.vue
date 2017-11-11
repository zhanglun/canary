<style lang="less">
  .app {
    background: orange;
  }
</style>
<template>
  <div class="app">
    <h1>Index</h1>
    <div>
      <m-dropdown>
        按钮
        <m-dropdown-menu slot="list">
          <m-dropdown-item>第一个选项</m-dropdown-item>
        </m-dropdown-menu>
      </m-dropdown>
    </div>
  </div>
</template>
<script>
  import { Dropdown, DropdownMenu, DropdownItem } from './components/dropdown';

  export default {
    name: 'app',
    components: {
      'm-dropdown': Dropdown,
      'm-dropdown-menu': DropdownMenu,
      'm-dropdown-item': DropdownItem,
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
