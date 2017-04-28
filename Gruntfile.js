module.exports = function (grunt) {
    "use strict";

    // TODO: Get from directory structure
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
     */
    function buildConcatConfig(options) {
        var result = {};

        result.options = options;

        assets.forEach(function (asset) {
            var moduleName = asset.key,
                namespaceSymbol = '$' + moduleName;

            result[asset.key] = {
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

    grunt.initConfig({
        concat: buildConcatConfig({
            separator: ';'
        })
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);
};