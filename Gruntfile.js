"use strict";

module.exports = function (grunt) {
  var moduleIds = grunt.file.expand({cwd: 'modules/'}, '*'),
      manifests = moduleIds.map(function (moduleId) {
        return grunt.file.readJSON('modules/' + moduleId + '/manifest.json');
      }),
      packages = moduleIds.map(function (moduleId) {
        return grunt.file.readJSON('modules/' + moduleId + '/package.json');
      });

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildConcatConfig(config) {
    config = config || {};

    moduleIds
    .map(function (moduleId, i) {
      return {
        moduleId: moduleId,
        manifest: manifests[i],
        pkg: packages[i]
      };
    })
    .filter(function (moduleInfo) {
      return moduleInfo.manifest.js;
    })
    .forEach(function (moduleInfo, i) {
      var moduleId = moduleInfo.moduleId,
          manifest = moduleInfo.manifest,
          pkg = moduleInfo.pkg,
          pkgName = pkg.name.split('/').pop(),
          dependencies = pkg.dependencies;

      config[moduleId] = {
        src: grunt.file.expand({
          cwd: ['modules', moduleId].join('/')
        }, manifest.js)
        .map(function (relativePath) {
          return ['modules', moduleId, relativePath].join('/');
        }),
        dest: ['modules', moduleId, 'lib', pkgName + '.js'].join('/'),
        options: {
          sourceMap: true,
          separator: ';\n',
          process: function (src, filepath) {
            return ['(function () {', src, '}());'].join('\n');
          },
          banner: [
            //@formatter:off
            '/*! ' + pkg.name + ' - v' + pkg.version +
            ' - <%= grunt.template.today("yyyy-mm-dd") %> */',
            '(function(){',
              'function d(require,exports,module){',
                // requiring CSS
                manifest.less || manifest.css ?
                    'try {window && require("css!' + moduleId + '")} catch (e) {}' :
                    undefined,
                grunt.file.read(['modules', moduleId, 'src/globals.js'].join('/'))
            //@formatter:on
          ].join('\n'),
          footer: [
            //@formatter:off
                // signaling module availability to app
                dependencies && dependencies['@protoboard/blend-module'] ?
                    'require("blend-module").Module.fromModuleId("' + moduleId + '").markAsAvailable();' :
                    undefined,
              '}',
              'var n="' + moduleId + '",e',
              '/* istanbul ignore next */',
              // node require - falling back to file in same folder
              'function rn(p){try{return require(p)}catch(e){return require("./"+p)}}',
              '/* istanbul ignore next */',
              // browser require
              'function rw(p){return window[p]}',
              '/* istanbul ignore next */',
              'if(typeof module=="object")d(rn,exports,module)',
              'else if(typeof define=="function")define(d)',
              'else d(rw,e=window[n]={},{exports:e});',
            '}())'
            //@formatter:on
          ].join('\n')
        }
      };
    });

    return config;
  }

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   * @todo This should be another concat / minification as way of bundling.
   */
  function buildCopyConfig(config) {
    config = config || {};

    moduleIds
    .forEach(function (moduleId, i) {
      var pkg = packages[i];
      config[moduleId] = {
        src: ['modules', moduleId, 'lib', '*'].join('/'),
        dest: 'public/',
        expand: true,
        flatten: true
      };
    });

    return config;
  }

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildLessConfig(config) {
    config = config || {};

    moduleIds
    .map(function (moduleId, i) {
      return {
        moduleId: moduleId,
        manifest: manifests[i],
        pkg: packages[i]
      };
    })
    .filter(function (moduleInfo) {
      return moduleInfo.manifest.less;
    })
    .forEach(function (moduleInfo) {
      var moduleId = moduleInfo.moduleId,
          manifest = moduleInfo.manifest,
          pkg = moduleInfo.pkg,
          pkgName = pkg.name.split('/').pop();

      config[moduleId] = {
        src: grunt.file.expand({
          cwd: ['modules', moduleId].join('/')
        }, manifest.less)
        .map(function (relativePath) {
          return ['modules', moduleId, relativePath].join('/');
        }),
        dest: ['modules', moduleId, 'lib', pkgName + '.css'].join('/'),
        options: {}
      };
    });

    return config;
  }

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildKarmaConfig(config) {
    config = config || {};

    moduleIds
    .filter(function (moduleId) {
      var karmaConfigPath = ['modules', moduleId, 'karma.conf.js'].join('/');
      return grunt.file.exists(karmaConfigPath);
    })
    .forEach(function (moduleId) {
      config[moduleId] = {
        configFile: ['modules', moduleId, 'karma.conf.js'].join('/')
      };
    });

    return config;
  }

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildWatchConfig(config) {
    config = config || {};

    moduleIds.forEach(function (moduleId) {
      config[moduleId + '-js'] = {
        files: [
          'modules/' + moduleId + '/src/**/*.js',
          '!modules/' + moduleId + '/src/**/*.spec.js',
          'modules/' + moduleId + '/@(package|manifest).json'],
        tasks: ['concat:' + moduleId, 'copy:' + moduleId,
          'notify:build-' + moduleId]
      };
      config[moduleId + '-less'] = {
        files: [
          'modules/' + moduleId + '/src/**/*@(.css|.less)',
          'modules/' + moduleId + '/@(package|manifest).json'],
        tasks: ['less:' + moduleId, 'copy:' + moduleId,
          'notify:build-' + moduleId]
      };
    });

    return config;
  }

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildNotifyConfig(config) {
    config = config || {};

    moduleIds.forEach(function (moduleId) {
      config['build-' + moduleId] = {
        options: {
          message: 'Module "' + moduleId + '" built'
        }
      };
    });

    return config;
  }

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildNpmConfig(config) {
    config = config || {};

    moduleIds.forEach(function (moduleId) {
      config[moduleId] = {
        options: {
          cwd: ['modules', moduleId].join('/')
        }
      };
    });

    return config;
  }

  grunt.initConfig({
    clean: {
      build: ['modules/*/lib', 'public'],
      doc: ['doc/api'],
      coverage: ['doc/coverage'],
      pack: ['modules/*/*.tgz']
    },

    concat: buildConcatConfig({
      /**
       * todo Build by blending HTML documents rather than concatenating HEAD
       * todo Read template list from module manifests
       * todo Use package dependency graph to determine order
       * todo Treat debug templates separately
       */
      'index.html': {
        src: [
          "modules/blend-ui/templates/require.html",
          "modules/*/templates/*.html"
        ],
        dest: "public/index.html",
        options: {
          banner: [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>'
          ].join('\n'),
          footer: [
            '</head>',
            '<body>',
            '</body>',
            '</html>'
          ].join('\n')
        }
      }
    }),

    copy: buildCopyConfig(),

    less: buildLessConfig({
      options: {
        sourceMap: true
      }
    }),

    'string-replace': {
      dist: {
        options: {
          replacements: []
        },
        files: [{
          src: 'templates/index.html',
          dest: 'public/index.html'
        }, {
          src: 'templates/perf.html',
          dest: 'public/perf.html'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      dist: ['Gruntfile.js', 'modules/*/src/**/*.js']
    },

    karma: buildKarmaConfig({
      coverage: {
        configFile: './karma.conf.js',
        reporters: 'coverage'
      }
    }),

    watch: buildWatchConfig({
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build-quick']
      },
      templates: {
        files: ['templates/**/*.*'],
        tasks: ['build-quick']
      }
    }),

    notify: buildNotifyConfig({
      options: {
        title: 'Blend'
      },
      doc: {
        options: {
          message: 'Documentation ready'
        }
      },
      'build-quick': {
        options: {
          message: 'Quick build ready'
        }
      },
      'build-full': {
        options: {
          message: 'Full build ready'
        }
      }
    }),

    jsdoc: {
      dist: {
        src: ['modules/*/lib/*', 'README.md'],
        options: {
          destination: 'doc/api',
          template: "node_modules/ink-docstrap/template",
          configure: "jsdoc.conf.json"
        }
      }
    },

    'npm-command': buildNpmConfig({
      options: {
        cmd: 'pack'
      }
    })
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-npm-command');

  grunt.registerTask('doc', ['clean:doc', 'jsdoc', 'notify:doc']);
  grunt.registerTask('test', ['clean:coverage', 'jshint', 'karma']);
  grunt.registerTask('coverage', ['clean:coverage', 'karma:coverage']);
  grunt.registerTask('build-quick', ['clean:build', 'concat',
    'less', 'copy', 'notify:build-quick']);
  grunt.registerTask('build-full', ['clean', 'concat', 'less',
    'copy', 'test', 'jsdoc', 'notify:build-full']);
  grunt.registerTask('pack', ['clean:pack', 'npm-command']);
  grunt.registerTask('default', ['build-quick', 'watch']);
};
