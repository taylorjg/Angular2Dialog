'use strict';

const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');

gulp.task('clean', function (done) {
    del(['./server/public'], done);
});

gulp.task('webpack', function (done) {
    const config = require('./webpack.config.js');
    webpack(config, function(err, stats) {
        done();
    });
});

gulp.task('build', ['clean', 'webpack'], function () {
});

gulp.task('default', ['build'], function () {
});
