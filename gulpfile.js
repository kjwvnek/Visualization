const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const rename = require('gulp-rename');
const through2 = require('through2');

const projects = fs.readdirSync(path.resolve(__dirname, 'packages'));

gulp.task('build', gulpTaskBuild);

function gulpTaskBuild() {
  gulp.src(path.resolve(__dirname, 'index.html'))
    .pipe(through2.obj(function(chunk, encoding, callback) {
      let htmlString = chunk.contents.toString(encoding);
      let srcUrl = './js/index.bundle.js';

      chunk.contents = new Buffer(insertScriptTagIntoHtml(htmlString, srcUrl));
      callback(null, chunk);
    }))
    .pipe(gulp.dest(path.resolve(__dirname, 'docs')));

  return loopProjectAsync(function(project) {
    return gulp.src(path.resolve(__dirname, `packages/${project}/index.html`))
      .pipe(through2.obj(function(chunk, encoding, callback) {
        let htmlString = chunk.contents.toString(encoding);
        let srcUrl = `../js/${project}.bundle.js`;
  
        chunk.contents = new Buffer(insertScriptTagIntoHtml(htmlString, srcUrl));
        callback(null, chunk);
      }))
      .pipe(rename(`${project}.html`))
      .pipe(gulp.dest(path.resolve(__dirname, 'docs/view')));
  });
}

function insertScriptTagIntoHtml(htmlString, srcUrl) {
  let insertIndex = htmlString.indexOf('</body>');
  let scriptTag = `<script src="${srcUrl}"></script>`;

  return htmlString.substring(0, insertIndex) + scriptTag + htmlString.substring(insertIndex);
}

function loopProjectAsync(callback) {
  const promises = projects.reduce((accum, project) => {
    accum.push(new Promise(function(resolve) {
      resolve(callback(project));
    }));

    return accum;
  }, []);

  return Promise.all(promises);
}

