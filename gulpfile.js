(function() {
    
    "use strict";
    
    var gulp = require("gulp");
    var ts = require('gulp-typescript');
    var del = require('del');
    
    var PATHS = {
        libs: [
            "node_modules/core-js/client/shim.js",
            "node_modules/zone.js/dist/zone.js",
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/systemjs/dist/system.src.js"
        ],
        client: {
            ts: "client/app/**/*.ts",
            html: "client/**/*.{html,css}"
        },
        dist: "server/dist",
        distApp: "server/dist/app",
        distLibs: "server/dist/libs"
    };

    var tsProject = ts.createProject("tsconfig.json");    
    
    gulp.task("clean", function (done) {
        del([PATHS.dist], done);
    });

    gulp.task("ts", function () {
        return gulp
            .src(PATHS.client.ts)
            .pipe(ts(tsProject))
            .pipe(gulp.dest(PATHS.distApp));
    });

    gulp.task("html", function () {
        return gulp
            .src(PATHS.client.html)
            .pipe(gulp.dest(PATHS.dist));
    });

    gulp.task("libs", function () {
        return gulp
            .src(PATHS.libs)
            .pipe(gulp.dest(PATHS.distLibs));
    });

    gulp.task("build", ["ts", "html", "libs"], function () {
    });

    gulp.task("default", ["build"], function () {
    });
}());
