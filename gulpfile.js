const {series, src, dest, watch} = require('gulp');
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

function processHTML(){
    return src(['index.html', 'blog.html'])
        .pipe(dest('dist'));
}

function processJS() {
    return src(['functions.js', 'blog.js'])
        .pipe(jshint({
            esversion: 8
        }))
        .pipe(jshint.reporter('default'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('dist'));
}

function processImgs() {
    return src('images/*')
        .pipe(dest('dist/images'));
}

function babelPolyfill() {
    return src('node_modules/@babel/polyfill/browser.js')
        .pipe(dest('dist/node_modules/@babel/polyfill'));
}

function watchFiles(){
        series(processHTML, processJS, babelPolyfill, processImgs);
        watch('*.js', processJS);
        watch('*.html', processHTML);
        watch('images/*', processImgs);
        watch('dist/*.js', syncBrowser.reload());
        watch('dist/*.html', syncBrowser.reload());
    }

function syncBrowser () {
    browserSync.init({
        server: './dist',
        port: 8080,
        ui: {
            port: 8081
        }
        });
};



exports.babelPolyfill = babelPolyfill;
exports.processJS = processJS;
exports.processHTML = processHTML;
exports.processImgs = processImgs;
exports.syncBrowser = syncBrowser;
exports.default = series(processHTML, processJS, babelPolyfill, watchFiles, processImgs);