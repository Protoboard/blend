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
     * TODO: Pass in asset type.
     * @param options
     */
    function buildConfig(options) {
        var result = {};

        result.options = options;

        assets.forEach(function (asset) {
            result[asset.key] = {
                src: asset.value.js.map(function (relativePath) {
                    return ['modules', asset.key, relativePath].join('/');
                }),
                dest: ['dist', asset.key + '.js'].join('/')
            };
        });

        return result;
    }

    grunt.initConfig({
        concat: buildConfig({
            separator: ';'
        })
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);
};