const download = require('download');
const gulp = require('gulp');

const ROOT = process.cwd;

function startDownload() {
	return download(NODE_URL, NODE_PATH);
}

gulp.task('download:node', async (cb) => {
	await startDownload();
});
