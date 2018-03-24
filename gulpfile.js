/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
// var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;


gulp.task('copyHtml' ,function() {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'));
});

// gulp.task('scripts', function() {
// 	gulp.src('js/**/*.js')
// 		.pipe(concat('all.js'))
// 		.pipe(gulp.dest('dist/js'));
// });

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('copy-images', function() {
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('scripts-dist', function(done) {
	gulp.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
        done();
});

gulp.task('lint', function () {
	return gulp.src(['js/**/*.js', '!libs/**'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
        .pipe(eslint({
            globals: [
                'jQuery',
                '$'
            ]
        }))
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError())
})


gulp.task('dist', gulp.parallel('copyHtml', 'styles', 'copy-images', 'lint', 'scripts-dist'));

gulp.task('default', gulp.parallel('copyHtml', 'styles', 'copy-images', 'lint', 'scripts-dist', function() {
    // do more stuff
    gulp.watch('sass/**/*.scss', gulp.parallel('styles'));
    gulp.watch('js/**/*.js', gulp.parallel('scripts-dist'));
	gulp.watch('js/**/*.js', gulp.parallel('lint'));
	gulp.watch('index.html', gulp.parallel('copyHtml'));
	gulp.watch('./dist/index.html').on('change', browserSync.reload);

	browserSync.init({
		server: './dist'
	});
  
  }));