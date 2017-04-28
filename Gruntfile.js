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
        concat: buildConcatConfig({
            separator: ';'
        }),

        karma: buildKarmaConfig(),

        watch: {
            files: ['modules/**/*.js'],
            tasks: ['build']
        },

        notify: {
            build: {
                options: {
                    title: 'GiantJS',
                    message: 'Build done'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('build', ['concat', 'notify:build']);
    grunt.registerTask('default', ['build', 'watch']);
};