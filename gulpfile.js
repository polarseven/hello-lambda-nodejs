const del = require('del');
const gulp = require('gulp');
const sequence = require('run-sequence');
const zip = require('gulp-zip');

gulp.task('clean', (callback) =>
  del(['dist'], callback)
);

gulp.task('scripts', () =>
  gulp.src('src/main/js/**/*.js')
  .pipe(gulp.dest('dist/build'))
);

gulp.task('modules', () =>
  gulp.src('node_modules/**')
  .pipe(gulp.dest('dist/build/node_modules'))
);

gulp.task('zip', () =>
  gulp.src('dist/build/**')
  .pipe(zip('archive.zip'))
  .pipe(gulp.dest('dist'))
);

gulp.task('default', ['clean'], () =>
  sequence(['scripts', 'modules'], 'zip')
);
