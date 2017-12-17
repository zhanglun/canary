<template>
  <div :style="style"></div>
</template>

<script>
const  debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    let callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
};

const monacoLoader = require('./loader');

export default {
  props: {
    width: {
      type: [String, Number], 
      default: '100%',
    },
    height: {
      type: [String, Number], 
      default: '100%',
    },
    value: {
      type: String, 
      default: '// code \n',
    },
    srcPath: {
      type: String,
    },
    language: { 
      type: String, 
      default: 'javascript'
    },
    theme: { 
      type: String, 
      default: 'vs-dark',
    }, // vs, hc-black
    options: {
      type: Object, default: () => {},
    },
    highlighted: {
      type: Array, 
      default: () => [{
        number: 0,
        class: ''
      }],
    },
    changeThrottle: { 
      type: Number, 
      default: 0,
    },
  },
  mounted() {
    this.fetchEditor();
  },
  destroyed() {
    this.destroyMonaco();
  },
  computed: {
    style() {
      const { width, height } = this;
      const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
      const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;

      return {
        width: fixedWidth,
        height: fixedHeight,
      };
    },
    editorOptions() {
      return Object.assign({}, this.defaults, this.options, {
        value: this.value,
        language: this.language,
        theme: this.theme
      });
    }
  },
  data() {
    return {
      defaults: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        glyphMargin: true
      }
    }
  },
  watch: {
    highlighted: {
      handler(lines) {
        this.highlightLines(lines);
      },
      deep: true
    },
    language (update) {
      console.log(update);
      console.log(window.monaco.editor.setModelLanguage);
      window.monaco.editor.setModelLanguage(this.editor.getModel(), update);
    }
  },
  methods: {
    // 高亮每一行
    highlightLines(lines) {
      if (!this.editor) {
        return;
      }

      lines.forEach((line) => {
        const className = line.class;
        const highlighted = this.$el.querySelector(`.${className}`);
        if (highlighted) {
          highlighted.classList.remove(className);
        }
        const number = parseInt(line.number);
        if (!this.editor && number < 1 || isNaN(number)) {
          return;
        }
        const selectedLine = this.$el.querySelector(`.view-lines [linenumber="${number}"]`);

        if (selectedLine) {
          selectedLine.classList.add(className);
        }
      });
    },
    editorHasLoaded(editor, monaco) {
      this.editor = editor;
      this.monaco = monaco;
      this.editor.onDidChangeModelContent(event =>
        this.codeChangeHandler(editor, event)
      );
      this.languages = monaco.languages.getLanguages();

      // 初始化事件
      this.$emit('mounted', editor);
    },

    codeChangeHandler: function(editor) {
      if (this.codeChangeEmitter) {
        this.codeChangeEmitter(editor);
      } else {
        this.codeChangeEmitter = debounce(
          function(editor) {
            this.$emit('codeChange', editor);
          },
          this.changeThrottle
        );
        this.codeChangeEmitter(editor);
      }
    },
    fetchEditor() {
      monacoLoader.load(this.srcPath, this.createMonaco);
    },
    createMonaco() {
      this.editor = window.monaco.editor.create(this.$el, this.editorOptions);
      this.editorHasLoaded(this.editor, window.monaco);

    },
    destroyMonaco() {
      if (typeof this.editor !== 'undefined') {
        this.editor.dispose();
      }
    },

    __getLanguages() {
      return this.languages;
    },
  },
};
</script>
