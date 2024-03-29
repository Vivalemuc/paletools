const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const minifyJs = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const gulpCopy = require('gulp-copy');
const obfuscateJs = require('gulp-javascript-obfuscator');
const scan = require('gulp-scan');


const fileVersions = {};

function getJsCode(filePath, vinylFile){
    return vinylFile.contents;
}

function getCssCode(filePath, vinylFile) {
    return new Buffer(`(function(){
        let style = document.getElementById('${filePath.name}');
        if(!style){
            style = document.createElement('style');
            style.id = '${filePath.name}';
            document.body.appendChild(style);
            style.innerText = '${vinylFile.contents}';
        }
        else {
            style.remove();
        }
        
    })()`);
}

function base64Encode(getCode){
    return through.obj(function (vinylFile, encoding, callback) {
        // 1. clone new vinyl file for manipulation
        // (See https://github.com/wearefractal/vinyl for vinyl attributes and functions)
        var transformedFile = vinylFile.clone();
        let filePath = path.parse(transformedFile.path);
        // 2. set new contents
        // * contents can only be a Buffer, Stream, or null
        // * This allows us to modify the vinyl file in memory and prevents the need to write back to the file system.
        //transformedFile.contents = Buffer.from(`"${filename}": "${vinylFile.contents.toString('base64')}",`);
        transformedFile.contents = Buffer.from(`window.paletools = window.paletools || {};\nwindow.paletools['${filePath.name}-${fileVersions[transformedFile.path]}'] = "${getCode(filePath, vinylFile).toString('base64')}"`);
        // 3. pass along transformed file for use in next `pipe()`
        callback(null, transformedFile);
      });
}


 
//basic example
gulp.task('build-css', function(){
    return gulp.src(['./src/*.css'])
    .pipe(scan({ term: /v\d+\.\d+.\d+/gm, fn: function (match, file) {
        console.log(`${file.path} ${JSON.stringify(match)}`);
        fileVersions[file.path] = match.match(/(\d+\.\d+\.\d+)/gm)[0];
    }}))
    .pipe(cleanCss())
    .pipe(base64Encode(getCssCode))
    .pipe(rename(path => {
        path.extname = '.js';
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-js', function () {
    return gulp.src(['./src/*.js'])
            .pipe(scan({ term: /const\s*VERSION\s*=\s*".*";/gm, fn: function (match, file) {
                console.log(file.path);
                fileVersions[file.path] = match.match(/(\d+\.\d+.?\d*)/gm)[0];
            }}))
            .pipe(minifyJs())
            .pipe(base64Encode(getJsCode))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('build-js-obfuscated', function () {
    return gulp.src(['./src/*.js'])
            .pipe(scan({ term: /const\s*VERSION\s*=\s*".*";/gm, fn: function (match, file) {
                console.log(file.path);
                fileVersions[file.path] = match.match(/(\d+\.\d+)/gm)[0];
            }}))
            .pipe(obfuscateJs({
                compact: true,
                selfDefending: true
            }))
            .pipe(base64Encode(getJsCode))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-to-dest', function() {
    return gulp.src(['./dist/*.js'])
                .pipe(gulpCopy('d:\\code\\eallegretta.github.io\\fifa\\'));

});
gulp.task('deploy', gulp.series('build-js', 'build-css', 'copy-to-dest'));

gulp.task('default', gulp.parallel('build-js', 'build-css'));