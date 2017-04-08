<style lang="less">
	
</style>
<template>
	<div>
	 	<tree-node
    	class="item"
    	v-for="item in model"
    	:model="item">
  	</tree-node>
	</div>
</template>
<script>
	import TreeNode from './TreeNode.vue';
	export default {
		name: 'tree',
		props: {
			model: {
				type: Array,
			},
		},
		components: {
			TreeNode,
		},
		methods: {},
		mounted() {
			this.$on('on-click', () => {
        this.$emit('on-node-click');
      });
		}
	};
</script>
