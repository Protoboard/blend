"use strict";

/**
 * @function $buildUtils.ScriptCollection.create
 * @param {Object} [properties]
 * @param {Object} [properties.data] Path : body
 * @returns {$buildUtils.ScriptCollection}
 */

/**
 * Collection of scripts. Supports resolving dependency order.
 * @class $buildUtils.ScriptCollection
 * @extends $data.Collection
 */
$buildUtils.ScriptCollection = $oop.createClass('$buildUtils.ScriptCollection')
.blend($data.Collection)
.define(/** @lends $buildUtils.ScriptCollection# */{
  /**
   * @param {$buildUtils.SymbolExtractor} extractor
   * @returns {$data.StringDictionary}
   */
  getFilePathsVsExports: function (extractor) {
    return this
    .mapValues(function (script) {
      return script.extractExports(extractor);
    })
    .asDictionary()
    .toStringDictionary();
  },

  /**
   * @param {$buildUtils.SymbolExtractor} extractor
   * @returns {$data.StringDictionary}
   */
  getFilePathsVsImports: function (extractor) {
    return this
    .mapValues(function (script) {
      return script.extractImports(extractor);
    })
    .asDictionary()
    .toStringDictionary();
  },

  /**
   * @returns {Array.<string>}
   */
  getDependencyOrder: function (extractor) {
    var filePathsVsImports = this.getFilePathsVsImports(extractor),
        exportsVsFilePaths = this.getFilePathsVsExports(extractor)
        .swapKeysAndValues();

    // Constructing dependency graph and serializing.
    return filePathsVsImports
    .join(exportsVsFilePaths)
    .as($buildUtils.DependencyGraph)
    .serialize();
  }
})
.build();
