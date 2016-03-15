var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin'),
    livereload = require('gulp-livereload');

var files;
files = {
    source: './src/**/*.*',
    product: './dist/**/*.*',
    src: {
        html: './src/html/*.html',
        js: './src/js/*.js',
        less: './src/style/*.less'
    },
    dist: {
        html: './dist/html',
        js: './dist/js',
        less: './dist/style'
    }
};

gulp.task('style', function() {
    return gulp.src(files.src.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(files.dist.less))
        .pipe(gulp.dest('./src/style'));
});

gulp.task('babel', function() {
    return gulp.src(files.src.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(files.dist.js));
});

gulp.task('html', function() {
    return gulp.src(files.src.html)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(files.dist.html));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch([files.source, files.product], function(file) {
        livereload.changed(file.path);
    });
    gulp.watch([files.src.html], ['html']);
    gulp.watch([files.src.js], ['babel']);
    gulp.watch([files.src.less], ['style']);
});

/*
 *   @params
 *       babel 转码 es6 => es5
 *       uglify 压缩js
 *       less 编译 less
 *       autoprefixer 加 css 前缀
 *       cssmin 压缩 css
 *       htmlmin 压缩 html
 *       livereload 即时调试
 * */