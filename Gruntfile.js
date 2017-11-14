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
        assets: manifests[i].assets.js,
        pkg: packages[i]
      };
    })
    .filter(function (moduleInfo) {
      return moduleInfo.assets;
    })
    .forEach(function (moduleInfo, i) {
      var moduleId = moduleInfo.moduleId,
          assets = moduleInfo.assets,
          pkg = moduleInfo.pkg,
          dependencies = pkg.dependencies;

      config[moduleId] = {
        src: grunt.file.expand({
          cwd: ['modules', moduleId].join('/')
        }, assets)
        .map(function (relativePath) {
          return ['modules', moduleId, relativePath].join('/');
        }),
        dest: ['dist', pkg.name + '.js'].join('/'),
        options: {
          separator: '\n',
          process: function (src, filepath) {
            return ['(function () {', src, '}());'].join('\n');
          },
          banner: [
            '/*! ' + pkg.name + ' - v' + pkg.version +
            ' - <%= grunt.template.today("yyyy-mm-dd") %> */',
            '(function(){',
            'function d(require,exports,module){',
            grunt.file.read(['modules', moduleId, 'globals.js'].join('/'))
          ].join('\n'),
          footer: [
            // signaling module availability to app
            dependencies && dependencies['blend-module'] ?
                'require("blend-module").Module.fromModuleId("' + moduleId + '").markAsAvailable()' :
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
            'else d(rw,e=window[n]={},{exports:e})',
            '}())'
          ].join('\n')
        }
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
        assets: manifests[i].assets.less,
        pkg: packages[i]
      };
    })
    .filter(function (moduleInfo) {
      return moduleInfo.assets;
    })
    .forEach(function (moduleInfo) {
      var moduleId = moduleInfo.moduleId,
          assets = moduleInfo.assets,
          pkg = moduleInfo.pkg;

      config[moduleId] = {
        src: grunt.file.expand({
          cwd: ['modules', moduleId].join('/')
        }, assets)
        .map(function (relativePath) {
          return ['modules', moduleId, relativePath].join('/');
        }),
        dest: ['dist', pkg.name + '.css'].join('/'),
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

    // todo Filter by config file presence.
    moduleIds.forEach(function (moduleId) {
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
      config[moduleId] = {
        files: [
          'modules/' + moduleId + '/**/*@(.js|.css|.less)',
          '!modules/' + moduleId + '/**/*.spec.js',
          'modules/' + moduleId + '/@(package|manifest).json'],
        tasks: ['concat:' + moduleId, 'notify:build-' + moduleId]
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

  grunt.initConfig({
    clean: {
      build: ['dist', 'public'],
      doc: ['doc']
    },

    concat: buildConcatConfig({
      options: {
        separator: ';',
        sourceMap: true
      }
    }),

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
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      dist: ['Gruntfile.js', 'modules/**/*.js']
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
        src: ['dist/*.js', 'README.md'],
        options: {
          destination: 'doc',
          template: "node_modules/ink-docstrap/template",
          configure: "jsdoc.conf.json"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('doc', ['clean:doc', 'jsdoc', 'notify:doc']);
  grunt.registerTask('test', ['jshint', 'karma']);
  grunt.registerTask('coverage', ['karma:coverage']);
  grunt.registerTask('build-quick', ['clean:build', 'string-replace', 'concat',
    'less', 'notify:build-quick']);
  grunt.registerTask('build-full', ['clean', 'string-replace', 'concat', 'less',
    'test', 'jsdoc', 'notify:build-full']);
  grunt.registerTask('default', ['build-quick', 'watch']);
};
