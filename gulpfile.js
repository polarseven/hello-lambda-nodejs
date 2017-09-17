const del = require('del');
const gulp = require('gulp');
const sequence = require('run-sequence');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const tsProject = ts.createProject('tsconfig.json');
const zip = require('gulp-zip');

gulp.task('clean', (callback) =>
  del(['dist'], callback)
);

gulp.task('lint', () =>
  gulp.src('src/main/ts/**/*.ts')
    .pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report())
);

gulp.task('scripts', () =>
  tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist/build'))
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

gulp.task('dist-with-modules', ['clean'], () =>
  sequence(['lint', 'scripts', 'modules'], 'zip')
);

gulp.task('default', ['clean'], () =>
  sequence(['lint', 'scripts'], 'zip')
);
