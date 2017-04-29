module.exports = function (grunt) {
    "use strict";

    // TODO: Get module names from directory structure
    var moduleNames = ['oop'],
        manifests = moduleNames.map(function (moduleName) {
            return grunt.file.readJSON('modules/' + moduleName + '/manifest.json');
        }),
        packages = moduleNames.map(function (moduleName) {
            return grunt.file.readJSON('modules/' + moduleName + '/package.json');
        });

    /**
     * @param options
     * @returns {object}
     */
    function buildConcatConfig(options) {
        var result = {};

        result.options = options;

        moduleNames.forEach(function (moduleName, i) {
            var namespaceSymbol = '$' + moduleName,
                assets = manifests[i].assets,
                pkg = packages[i];

            result[moduleName] = {
                src: assets.js.map(function (relativePath) {
                    return ['modules', moduleName, relativePath].join('/');
                }),
                dest: ['dist', moduleName + '.js'].join('/'),
                options: {
                    banner: [
                        '/*! ' + pkg.name + ' - v' + pkg.version + ' - <%= grunt.template.today("yyyy-mm-dd") %> */',
                        '(function () {',
                        '/** @exports ' + namespaceSymbol + ' */',
                        'var ' + namespaceSymbol + ' = {};',
                        'if (typeof define !== "undefined") define(function () {return ' + namespaceSymbol + ';})',
                        'else if (typeof window !== "undefined") window["' + namespaceSymbol + '"] = ' + namespaceSymbol,
                        'else module.exports = ' + namespaceSymbol + ';',
                        ''
                    ].join('\n'),
                    footer: [
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
            files: ['modules/**/*.js'],
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