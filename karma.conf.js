/*jshint strict:false */
module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'modules/blend-assert/lib/blend-assert.js',
      'modules/blend-oop/lib/blend-oop.js',
      'modules/blend-utils/lib/blend-utils.js',
      'modules/blend-data/lib/blend-data.js',
      'modules/blend-event/lib/blend-event.js',
      'modules/blend-module/lib/blend-module.js',
      'modules/blend-template/lib/blend-template.js',
      'modules/blend-entity/lib/blend-entity.js',
      'modules/blend-router/lib/blend-router.js',
      'modules/blend-api/lib/blend-api.js',
      'modules/blend-session/lib/blend-session.js',
      'modules/blend-widget/lib/blend-widget.js',
      'modules/blend-i18n/lib/blend-i18n.js',
      'modules/blend-ui/lib/blend-ui.js',
      'modules/blend-build-utils/lib/blend-build-utils.js',
      'modules/blend-cli-utils/lib/blend-cli-utils.js',
      'helpers/jasmine/*.js',
      'modules/*/src/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'modules/*/lib/*': ['coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'doc/coverage/'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch: false,

    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
