(function() {
    
    "use strict";
    
    var gulp = require("gulp");
    var ts = require('gulp-typescript');
    var del = require('del');
    
    var PATHS = {
        libs: [
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/angular2/bundles/angular2.dev.js",
            "node_modules/rxjs/bundles/Rx.js"
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
        console.log("Inside clean gulp task");
        del([PATHS.dist], done);
    });

    gulp.task("ts", function () {
        console.log("Inside ts gulp task");
        return gulp
            .src(PATHS.client.ts)
            .pipe(ts(tsProject))
            .pipe(gulp.dest(PATHS.distApp));
    });

    gulp.task("html", function () {
        console.log("Inside html gulp task");
        return gulp
            .src(PATHS.client.html)
            .pipe(gulp.dest(PATHS.dist));
    });

    gulp.task("libs", function () {
        console.log("Inside libs gulp task");
        return gulp
            .src(PATHS.libs)
            .pipe(gulp.dest(PATHS.distLibs));
    });

    gulp.task("build", ["ts", "html", "libs"], function () {
        console.log("Inside build gulp task");
    });

    gulp.task("default", ["build"], function () {
        console.log("Inside default gulp task");
    });
}());
