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
  getFileNamesVsDefined: function (extractor) {
    return this
    .mapValues(function (script) {
      return script.extractDefinedSymbols(extractor);
    })
    .asDictionary()
    .toStringDictionary();
  },

  /**
   * @param {$buildUtils.SymbolExtractor} extractor
   * @returns {$data.StringDictionary}
   */
  getFileNamesVsReferenced: function (extractor) {
    return this
    .mapValues(function (script) {
      return script.extractReferencedSymbols(extractor);
    })
    .asDictionary()
    .toStringDictionary();
  },

  /**
   * @returns {Array.<string>}
   */
  getDependencyOrder: function (extractor) {
    var fileNamesVsImports = this.getFileNamesVsReferenced(extractor),
        exportsVsFileNames = this.getFileNamesVsDefined(extractor)
        .swapKeysAndValues();

    // Constructing dependency graph and serializing.
    return fileNamesVsImports
    .join(exportsVsFileNames)
    .as($buildUtils.DependencyGraph)
    .serialize();
  }
})
.build();
