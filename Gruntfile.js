"use strict";

module.exports = function (grunt) {
  var moduleNames = grunt.file.expand({cwd: 'modules/'}, '*'),
      manifests = moduleNames.map(function (moduleName) {
        return grunt.file.readJSON('modules/' + moduleName + '/manifest.json');
      }),
      packages = moduleNames.map(function (moduleName) {
        return grunt.file.readJSON('modules/' + moduleName + '/package.json');
      });

  /**
   * @param {Object} config Holds module-independent configuration.
   * @returns {Object} Task configuration with modules.
   */
  function buildConcatConfig(config) {
    config = config || {};

    moduleNames.forEach(function (moduleName, i) {
      var assets = manifests[i].assets,
          pkg = packages[i];

      config[moduleName] = {
        src: grunt.file.expand({
          cwd: ['modules', moduleName].join('/')
        }, assets.js)
        .map(function (relativePath) {
          return ['modules', moduleName, relativePath].join('/');
        }),
        dest: ['dist', pkg.name + '.js'].join('/'),
        options: {
          banner: [
            '/*! ' + pkg.name + ' - v' + pkg.version +
            ' - <%= grunt.template.today("yyyy-mm-dd") %> */',
            '(function(){',
            'function d(require,exports,module){',
            ''
          ].join('\n'),
          footer: [
            '}',
            'var n="' + pkg.name + '",e',
            'function rn(p){try{return require(p)}catch(e){return require("./"+p)}}',
            'function rw(p){return window[p]}',
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
  function buildKarmaConfig(config) {
    config = config || {};

    moduleNames.forEach(function (moduleName) {
      config[moduleName] = {
        configFile: ['modules', moduleName, 'karma.conf.js'].join('/')
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

    moduleNames.forEach(function (moduleName) {
      config[moduleName] = {
        files: [
          'modules/' + moduleName + '/**/*@(.js|.css|.less)',
          '!modules/' + moduleName + '/**/*.spec.js',
          'modules/' + moduleName + '/@(package|manifest).json'],
        tasks: ['concat:' + moduleName, 'notify:build-' + moduleName]
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

    moduleNames.forEach(function (moduleName) {
      config['build-' + moduleName] = {
        options: {
          message: 'Module "' + moduleName + '" built'
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
    'notify:build-quick']);
  grunt.registerTask('build-full', ['clean', 'string-replace', 'concat', 'test',
    'jsdoc', 'notify:build-full']);
  grunt.registerTask('default', ['build-quick', 'watch']);
};
