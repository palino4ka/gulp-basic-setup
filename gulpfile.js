const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const browserslist = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
const  sourcemaps = require('gulp-sourcemaps');

function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'));
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(browserslist({
            cascade: false
        }))
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

function clear() {
    return del('dist');
}

function serve() {
    sync.init({
        server: './dist'
    });

    watch('src/**.html', series(html)).on('change', sync.reload);
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload);
}

exports.build = series(clear, scss, html);
exports.serve = series(clear, scss, html, serve);
exports.clear = clear;