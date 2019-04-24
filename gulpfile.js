var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var minify = require('gulp-minify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
   entryFile: './src/app.js',
   outputDir: './dist/',
   outputFile: 'app.js'
};

var bundler;

function getBundler() {
   if (!bundler) {
      bundler = watchify(browserify(config.entryFile, _.extend({
         debug: true
      }, watchify.args)));
   }
   return bundler;
};

function bundle() {
   return getBundler()
      .transform(babelify)
      .bundle()
      .on('error', function(err) {
         console.log('\x1b[31m%s\x1b[0m', 'Ошибка: ' + err.message);
         this.emit('end')
      })
      .pipe(source(config.outputFile))
      .pipe(gulp.dest(config.outputDir))
      .pipe(reload({
         stream: true
      }));
}

// clean the output directory
gulp.task('clean', function(cb) {
   rimraf(config.outputDir, cb);
});

gulp.task('build-persistent', function() {
   return bundle();
});

gulp.task('build', ['clean', 'build-persistent'], function() {
   gulp.src('dist/*.js')
      .pipe(minify({
         ext: {
            min: '.min.js'
         }
      }))
      .pipe(gulp.dest('dist'))
});

gulp.task('watch', ['build-persistent'], function() {
   browserSync({
      server: {
         baseDir: './'
      }
   });
   getBundler().on('update', function() {
      gulp.start('build-persistent')
   });
});

// WEB SERVER
gulp.task('serve', function() {
   browserSync({
      server: {
         baseDir: './'
      }
   });
});
