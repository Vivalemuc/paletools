const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const minify = require('gulp-minify');

function base64Encode(){
    return through.obj(function (vinylFile, encoding, callback) {
        // 1. clone new vinyl file for manipulation
        // (See https://github.com/wearefractal/vinyl for vinyl attributes and functions)
        var transformedFile = vinylFile.clone();
    
        var filename = path.parse(transformedFile.path).name;

        // 2. set new contents
        // * contents can only be a Buffer, Stream, or null
        // * This allows us to modify the vinyl file in memory and prevents the need to write back to the file system.
        //transformedFile.contents = Buffer.from(`"${filename}": "${vinylFile.contents.toString('base64')}",`);
        transformedFile.contents = Buffer.from(`window.paletoolsLink = "${vinylFile.contents.toString('base64')}";`);
    
        // 3. pass along transformed file for use in next `pipe()`
        callback(null, transformedFile);
      });
}


 
//basic example
gulp.task('build', function () {
    return gulp.src('./src/*.js')
            .pipe(minify())
            .pipe(base64Encode())
//            .pipe(concat('paletools.js'))
//            .pipe(wrap('window.paletools = { <%=contents%> };', {}, { parse: false }))
            .pipe(gulp.dest('./dist/'));
});