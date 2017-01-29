'use strict';

const gulp = require('gulp');
const gutil = require('gutil');
const del = require('del');
const webpack = require('webpack');

gulp.task('clean', done => del(['./server/public'], done));

gulp.task('webpack', done => {
    const config = require('./webpack.config.js');
    webpack(config, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        const errors = stats.toString('errors-only');
        if (errors) gutil.log('[webpack]', errors);
        done();
    });
});

gulp.task('build', ['clean', 'webpack']);

gulp.task('default', ['build']);
