var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	rev = require('gulp-rev-append'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	changed = require('gulp-changed'),
	minifyHTML = require('gulp-minify-html'),
	rimraf = require('gulp-rimraf'),
	es = require('event-stream'),
	gutil = require('gulp-util'),
	path = require('path'),
	clean = require('gulp-clean');

var paths = {
	htmls: ['../*.html'],
	scripts: ['../js/*.js'],
	css: ['../css/*.css']
};

var dest = {
	htmls: '../build',
	scripts: '../build/js/',
	css: '../build/css/'
}

gulp.task('jshint', function(){
	gulp.src(paths.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
	return ;
});

gulp.task('scripts', function(){
	gulp.src(paths.scripts)
		.pipe(uglify())
		// .pipe(concat('all.min.js'))
		.pipe(gulp.dest(dest.scripts));
	return ;
});

gulp.task('minify-css',function(){
	return gulp.src(paths.css)
		.pipe(minifyCSS({keeyBreaks:true}))
		.pipe(gulp.dest(dest.css))
});

gulp.task('rev', function(){
	return gulp.src(paths.htmls)
		.pipe(rev())
		.pipe(gulp.dest(dest.htmls));
})

gulp.task('watch', function(){
	gulp.watch(paths.scripts,  ['scripts','rev']);
	gulp.watch(paths.css,  ['minify-css','rev']);
	gulp.watch(paths.htmls,  ['rev']);
})

gulp.task('default', function(){
	gulp.src('../build')
		.pipe(clean());
});

gulp.task('default', ['scripts', 'minify-css', 'rev']);
