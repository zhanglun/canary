<style>
</style>
<template>
  <div>
    <h2>Tango</h2>
    <div class="tango-editor">
      <div ref="reference"></div>
      <select name="" id="" v-model="language">
        <option :value="item.id" v-for="(item, i) in languageList">{{item.id}}</option>
      </select>
      <button @click="getValue">get value</button>
      <tango
        height="600"
        srcPath=""
        theme='vs'
        :language="language"
        :value="value"
        :editorOptions="options"
        @mounted="onMounted"
        @codeChange="onValueChange"
        ref="tango-editor"></tango>
    </div>
  </div>
</template>
<script>
  import tango from '../../components/tango-editor/index.vue';

  export default {
    name: 'tango-editor',
    components: {
      tango,
    },
    data() {
      return  {
        value: '// Type away! \n',
        language: '',
        options: {
          selectOnLineNumbers: false
        },

        languageList: [],
      };
    },
    methods: {
      onMounted() {
        this.languageList = this.$refs['tango-editor'].__getLanguages();
        console.log(this.languageList);

        // 设置默认元素为文本
        this.language = this.languageList[0].aliases[0];
      },

      onValueChange() {
      },

      getValue() {
        console.log(this.value);
      }
    },
    mounted() {
    },
  }
</script>
