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
     * Converts dashed string to camelcase
     * @param dashedString
     * @returns {Array}
     */
    function dashToCamel(dashedString) {
        return dashedString.split('-')
            .map(function (token, i) {
                return i > 0 ?
                    token[0].toUpperCase() + token.slice(1).toLowerCase() :
                    token;
            });
    }

    /**
     * @param options
     * @returns {object}
     */
    function buildConcatConfig(options) {
        var result = {};

        result.options = options;

        moduleNames.forEach(function (moduleName, i) {
            var assets = manifests[i].assets,
                pkg = packages[i];

            result[moduleName] = {
                src: assets.js.map(function (relativePath) {
                    return ['modules', moduleName, relativePath].join('/');
                }),
                dest: ['dist', pkg.name + '.js'].join('/'),
                options: {
                    banner: [
                        '/*! ' + pkg.name + ' - v' + pkg.version + ' - <%= grunt.template.today("yyyy-mm-dd") %> */',
                        '(function () {',
                        'var exports = {}, require = require || function (module) {return window[module]};',
                        ''
                    ].join('\n'),
                    footer: [
                        'if (typeof define !== "undefined") define(function () {return exports;})',
                        'else if (typeof window !== "undefined") window["' + pkg.name + '"] = exports',
                        'else module.exports = exports;',
                        '}())'
                    ].join('\n')
                }
            };
        });

        return result;
    }

    /**
     * @param options
     * @returns {object}
     */
    function buildKarmaConfig(options) {
        var result = {};

        result.options = options;

        moduleNames.forEach(function (moduleName) {
            result[moduleName] = {
                configFile: ['modules', moduleName, 'karma.conf.js'].join('/')
            };
        });

        return result;
    }

    grunt.initConfig({
        clean: {
            build: ['dist'],
            doc: ['doc']
        },

        concat: buildConcatConfig({
            separator: ';'
        }),

        karma: buildKarmaConfig(),

        watch: {
            files: ['Gruntfile.js', 'modules/**/*.+(js|css|less)', 'modules/*/+(package|manifest).json'],
            tasks: ['build-quick']
        },

        notify: {
            options: {
                title: 'GiantJS'
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
        },

        jsdoc: {
            dist: {
                src: ['dist/*.js', 'README.md'],
                options: {
                    destination: 'doc',
                    template: "node_modules/ink-docstrap/template",
                    configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('doc', ['clean:doc', 'jsdoc', 'notify:doc']);
    grunt.registerTask('build-quick', ['clean:build', 'concat', 'notify:build-quick']);
    grunt.registerTask('build-full', ['clean', 'karma', 'concat', 'jsdoc', 'notify:build-full']);
    grunt.registerTask('default', ['build-quick', 'watch']);
};
