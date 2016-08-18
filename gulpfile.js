var del         = require('del');
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var cssnano     = require('gulp-cssnano');
var babel       = require('gulp-babel');
var usemin      = require('gulp-usemin');
var ghPages     = require('gulp-gh-pages');
var file        = require("gulp-file");

// Watch

gulp.task('dev-styles', function() {
    return gulp.src('src/assets/css/*.scss')
                .pipe(sass.sync().on('error', sass.logError))
                .pipe(gulp.dest(function(f) {
                    return f.base;
                }));
});

gulp.task('watch-styles', function() {
   return gulp.watch('src/assets/css/*.scss', ['dev-styles']);
});

gulp.task('watch', [ 'dev-styles', 'watch-styles' ]);

// Build

gulp.task('styles', ['static'], function() {
    return gulp.src('src/assets/css/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(cssnano())
                .pipe(gulp.dest('build/assets/css'));
});

gulp.task('scripts', function() {
    return gulp.src('src/index.html')
                .pipe(usemin({
                    js: [
                        babel({ presets: ['es2015'] }),
                        uglify()
                    ],
                    jsconfig: [
                        babel({ presets: ['es2015'] }),
                        uglify()
                    ]
                }))
                .pipe(gulp.dest('./build'));
});

gulp.task('static', ['clean'], function() {
  return gulp.src(['src/**/*', '!src/scripts/**/*', '!src/assets/css/**/*', '!src/index.html'])
             .pipe(gulp.dest('./build'));
});

gulp.task("clean", function() {
   del("build/*"); 
});

gulp.task('build', [ 'clean', 'static', 'styles', 'scripts' ]);

// Deploy

gulp.task('deploy:staging', ['build'], function() {
  return gulp.src([
      './build/**/*'
    ])
    .pipe(file('CNAME', "openui.nicontoso.eu"))
    .pipe(gulp.dest('./build'))
    .pipe(ghPages({remoteUrl: "https://github.com/nicoschmitt/openui.git"}));
});

gulp.task('deploy:production', ['build'], function() {
  return gulp.src([
      './build/**/*'
    ])
    .pipe(file('CNAME', "openpogoui.nicontoso.eu"))
    .pipe(gulp.dest('./build'))
    .pipe(ghPages({remoteUrl: "https://github.com/OpenPoGo/OpenPoGoUI.git"}));
});

// Default

gulp.task('default', [ 'dev-styles', 'build' ]);
