<template>
	<div>
		<div ref="reference"></div>
	</div>
</template>

<script>
	const loader = require('vs/loader.js');

	console.log(loader);

	export default {
		mounted() {
			loader.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
			loader.require(['vs/editor/editor.main'], function() {
				var editor = monaco.editor.create(document.getElementById('container'), {
					value: [
						'function x() {',
						'\tconsole.log("Hello world!");',
						'}'
					].join('\n'),
					language: 'javascript'
				});
			});
		},
	}
</script>
