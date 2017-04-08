<style lang="less">
  
</style>
<template>
  <ul>
    <li>
      <div
        :class="{bold: isParent}"
        @dblclick="changeType">
        <span @click="toggle">点击</span>
        <span @click="handleNodeClick">{{model.name}}</span>
        <!-- <span v-if="isParent">[{{open ? '-' : '+'}}]</span> -->
      </div>
      <ul v-show="open" v-if="isParent">
        <tree-node
          class="item"
          v-for="model in model.children"
          :model="model">
        </tree-node>
        <li class="add" @click="addChild">+</li>
      </ul>
    </li>
  </ul>
</template>
<script>
  // import TreeNode from './TreeNode.vue';
  export default {
    name: 'TreeNode',
    props: {
      model: Object
    },
    data: function () {
      return {
        open: false
      }
    },
    computed: {
      isParent: function () {
        return this.model.children &&
          this.model.children.length
      }
    },
    methods: {
      toggle: function () {
        if (this.isParent) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.isParent) {
          Vue.set(this.model, 'children', [])
          this.addChild()
          this.open = true
        }
      },
      addChild: function () {
        this.model.children.push({
          name: 'new stuff'
        })
      },
      handleNodeClick() {
        this.dispatch('Tree', 'on-click');
      }
    }
  };
</script>
