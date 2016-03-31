(function() {
    
    "use strict";
    
    var gulp = require("gulp");
    var ts = require('gulp-typescript');
    var del = require('del');
    
    var PATHS = {
        libs: [
            "node_modules/es6-shim/es6-shim.js",
            "node_modules/systemjs/dist/system-polyfills.js",
            "node_modules/angular2/es6/dev/src/testing/shims_for_IE.js",
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/rxjs/bundles/Rx.js",
            "node_modules/angular2/bundles/angular2.dev.js"
        ],
        client: {
            ts: "client/app/**/*.ts",
            html: "client/**/*.html"
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
