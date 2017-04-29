module.exports = function (grunt) {
    "use strict";

    // TODO: Get module names from directory structure
    var moduleNames = ['oop'],
        manifests = moduleNames.map(function (moduleName) {
            return {
                key: moduleName,
                value: grunt.file.readJSON('modules/' + moduleName + '/manifest.json')
            };
        }),
        assets = manifests.map(function (manifest) {
            return {
                key: manifest.key,
                value: manifest.value.assets
            };
        });

    /**
     * @param options
     * @returns {object}
     */
    function buildConcatConfig(options) {
        var result = {};

        result.options = options;

        assets.forEach(function (asset) {
            var moduleName = asset.key,
                namespaceSymbol = '$' + moduleName;

            result[moduleName] = {
                src: asset.value.js.map(function (relativePath) {
                    return ['modules', moduleName, relativePath].join('/');
                }),
                dest: ['dist', moduleName + '.js'].join('/'),
                options: {
                    banner: [
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

        assets.forEach(function (asset) {
            var moduleName = asset.key;

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
            tasks: ['build']
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
            build: {
                options: {
                    message: 'Build ready'
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

    grunt.registerTask('build', ['clean:build', 'concat', 'notify:build']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc', 'notify:doc']);
    grunt.registerTask('default', ['build', 'watch']);
};