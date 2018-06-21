"use strict";

/**
 * @function $buildUtils.SymbolExtractor.create
 * @param {Object} [properties]
 * @param {Array.<RegExp>} [properties.exportMatchers]
 * @param {Array.<RegExp>} [properties.importMatchers]
 * @returns {$buildUtils.SymbolExtractor}
 */

/**
 * Extracts exported / imported symbols from code.
 * @class $buildUtils.SymbolExtractor
 */
$buildUtils.SymbolExtractor = $oop.createClass('$buildUtils.SymbolExtractor')
.define(/** @lends $buildUtils.SymbolExtractor# */{
  /**
   * Symbol name must be the first match returned by RegExp#exec()
   * @member {Array.<RegExp>} $buildUtils.SymbolExtractor#exportMatchers
   */

  /**
   * Symbol name must be the first match returned by RegExp#exec()
   * @member {Array.<RegExp>} $buildUtils.SymbolExtractor#importMatchers
   */

  /** @ignore */
  defaults: function () {
    this.exportMatchers = this.exportMatchers || [];
    this.importMatchers = this.importMatchers || [];
  },

  /**
   * @param {Array.<RegExp>} matchers
   * @param {string} text
   * @returns {string[]}
   * @private
   */
  _extractSymbols: function (matchers, text) {
    var symbolLookup = matchers
    .reduce(function (result, matcher) {
      var hits;
      while ((hits = matcher.exec(text)) !== null) {
        result[hits[1]] = true;
      }
      return result;
    }, {});
    return Object.keys(symbolLookup);
  },

  /**
   * Extracts symbols that are defined in the specified script body.
   * @param {string} scriptBody
   * @returns {Array.<string>}
   */
  extractExports: function (scriptBody) {
    return this._extractSymbols(this.exportMatchers, scriptBody);
  },

  /**
   * Extracts symbols that are imported in the specified script body.
   * @param {string} scriptBody
   * @returns {Array.<string>}
   */
  extractImports: function (scriptBody) {
    return this._extractSymbols(this.importMatchers, scriptBody);
  }
})
.build();
