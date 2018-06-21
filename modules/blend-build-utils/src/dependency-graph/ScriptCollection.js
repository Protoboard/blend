"use strict";

/**
 * @function $buildUtils.ScriptCollection.create
 * @param {Object} [properties]
 * @param {Object} [properties.data] Path : body
 * @returns {$buildUtils.ScriptCollection}
 */

/**
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
  getFileNamesVsExports: function (extractor) {
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
  getFileNamesVsImports: function (extractor) {
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
    var fileNamesVsImports = this.getFileNamesVsImports(extractor),
        exportsVsFileNames = this.getFileNamesVsExports(extractor)
        .swapKeysAndValues();

    // Constructing dependency graph and serializing.
    return fileNamesVsImports
    .join(exportsVsFileNames)
    .as($buildUtils.DependencyGraph)
    .serialize();
  }
})
.build();
