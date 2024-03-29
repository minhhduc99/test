// Generated on 2017-05-31 using generator-jhipster 4.5.2
'use strict';

var gulp = require('gulp'),
    expect = require('gulp-expect-file'),
    es = require('event-stream'),
    flatten = require('gulp-flatten'),
    sass = require('gulp-sass'),
    rev = require('gulp-rev'),
    templateCache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    KarmaServer = require('karma').Server,
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
	zip = require('gulp-zip');

var handleErrors = require('./gulp/handle-errors'),
    serve = require('./gulp/serve'),
    util = require('./gulp/utils'),
    copy = require('./gulp/copy'),
    inject = require('./gulp/inject'),
    build = require('./gulp/build');

var config = require('./gulp/config');

gulp.task('clean', function () {
    return del([config.dist], { dot: true });
});

gulp.task('copy', ['copy:i18n', 'copy:fonts', 'copy:common']);

gulp.task('copy:i18n', copy.i18n);

gulp.task('copy:languages', copy.languages);

gulp.task('copy:fonts', copy.fonts);

gulp.task('copy:common', copy.common);

gulp.task('copy:swagger', copy.swagger);

gulp.task('copy:images', copy.images);

gulp.task('copy:datatables', copy.datatables);

gulp.task('copy:fullcalendar', copy.fullcalendar);

gulp.task('images', function () {
    return gulp.src(config.app + 'content/images/**')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'content/images'))
        .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'content/images'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function () {
    return es.merge(
        gulp.src(config.sassSrc)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(expect(config.sassSrc))
        .pipe(sass({includePaths:config.bower}).on('error', sass.logError))
        .pipe(gulp.dest(config.cssDir)),
        gulp.src(config.bower + '**/fonts/**/*.{woff,woff2,svg,ttf,eot,otf}')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.app + 'content/fonts'))
        .pipe(flatten())
        .pipe(gulp.dest(config.app + 'content/fonts'))
    );
});

gulp.task('styles', ['sass'], function () {
    return gulp.src(config.app + 'content/css')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', function() {
    runSequence('inject:dep', 'inject:app');
});

gulp.task('inject:dep', ['inject:test', 'inject:vendor']);

gulp.task('inject:app', inject.app);

gulp.task('inject:vendor', inject.vendor);

gulp.task('inject:test', inject.test);

gulp.task('inject:troubleshoot', inject.troubleshoot);

gulp.task('assets:prod', ['images', 'styles', 'html', 'copy:swagger', 'copy:images','copy:datatables', 'copy:fullcalendar'], build);
//gulp.task('assets:prod', ['styles', 'html', 'copy:swagger'], build);

gulp.task('html', function () {
    return gulp.src(config.app + 'app/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache({
            module: 'otmApp',
            root: 'app/',
            moduleSystem: 'IIFE'
        }))
        .pipe(gulp.dest(config.tmp));
});

gulp.task('ngconstant:dev', function () {
    return ngConstant({
        name: 'otmApp',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: true,
            API_URL:"localhost:9901",
            WEBSOCKET_URL:"localhost:9901",            
            SPACE: "SEV",
            CONST: {
              BASE_URL: config.uri + config.apiPort,
              MEMBER_ROLE: 1,
              LEADER_ROLE: 2,
              ADMIN_MGMT_ROLE: 3,
              OT_WEEKEND: 1,
              OT_SATURDAY: 2,              
            }
        },
        template: config.constantTemplate,
        stream: true
    })
    .pipe(rename('app.constants.js'))
    .pipe(gulp.dest(config.app + 'app/'));
});

gulp.task('ngconstant:prod', function () {
    return ngConstant({
        name: 'otmApp',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: false,
            API_URL:"localhost:9901",
            WEBSOCKET_URL:"localhost:9901",
            SPACE: "SEV",
            CONST: {
              MEMBER_ROLE: 1,
              LEADER_ROLE: 2,
              ADMIN_MGMT_ROLE: 3,
              OT_WEEKEND: 1,
              OT_SATURDAY: 2
            }
        },
        template: config.constantTemplate,
        stream: true
    })
    .pipe(rename('app.constants.js'))
    .pipe(gulp.dest(config.app + 'app/'));
});

gulp.task('ngconstant:prodsevt', function () {
    return ngConstant({
        name: 'otmApp',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: false,
            API_URL:"localhost:9901",
            WEBSOCKET_URL:"localhost:9901",
            SPACE: "SEVT",
            CONST: {
              MEMBER_ROLE: 1,
              LEADER_ROLE: 2,
              ADMIN_MGMT_ROLE: 3,
              OT_WEEKEND: 1,
              OT_SATURDAY: 2
            }
        },
        template: config.constantTemplate,
        stream: true
    })
    .pipe(rename('app.constants.js'))
    .pipe(gulp.dest(config.app + 'app/'));
});

// check app for eslint errors
gulp.task('eslint', function () {
    return gulp.src(['gulpfile.js', config.app + 'app/**/*.js'])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
// check app for eslint errors anf fix some of them
gulp.task('eslint:fix', function () {
    return gulp.src(config.app + 'app/**/*.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(util.isLintFixed, gulp.dest(config.app + 'app')));
});

//gulp.task('test', ['inject:test', 'ngconstant:dev'], function (done) {
//    new KarmaServer({
//        configFile: __dirname + '/' + config.test + 'karma.conf.js',
//        singleRun: true
//    }, done).start();
//});


gulp.task('watch', function () {
    gulp.watch('bower.json', ['install']);
    gulp.watch(['gulpfile.js', 'pom.xml'], ['ngconstant:dev']);
    gulp.watch(config.sassSrc, ['styles']);
    gulp.watch(config.app + 'content/images/**', ['images']);
    gulp.watch(config.app + 'app/**/*.js', ['inject:app']);
    gulp.watch([config.app + '*.html', config.app + 'app/**', config.app + 'i18n/**']).on('change', browserSync.reload);
});

gulp.task('zip', () =>
    gulp.src('dist/**')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('releases'))
);

gulp.task('install', function () {
    runSequence(['inject:dep', 'ngconstant:dev'], 'sass', 'copy:languages', 'inject:app', 'inject:troubleshoot');
});

gulp.task('serve', ['install'], serve);

gulp.task('build', ['clean'], function (cb) {
    runSequence(['copy', 'inject:vendor', 'ngconstant:prod', 'copy:languages'], 'inject:app', 'inject:troubleshoot', 'assets:prod', 'zip', cb);
});

gulp.task('build:sevt', ['clean'], function (cb) {
    runSequence(['copy', 'inject:vendor', 'ngconstant:prodsevt', 'copy:languages'], 'inject:app', 'inject:troubleshoot', 'assets:prod', 'zip', cb);
});

gulp.task('default', ['serve']);
