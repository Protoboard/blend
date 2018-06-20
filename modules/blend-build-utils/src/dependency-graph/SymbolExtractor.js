"use strict";

/**
 * @function $buildUtils.SymbolExtractor.create
 * @param {Object} [properties]
 * @returns {$buildUtils.SymbolExtractor}
 */

/**
 * Extracts symbols from code.
 * @class $buildUtils.SymbolExtractor
 */
$buildUtils.SymbolExtractor = $oop.createClass('$buildUtils.SymbolExtractor')
.define(/** @lends $buildUtils.SymbolExtractor# */{
  /**
   * Symbol name must be the first match returned by RegExp#exec()
   * @member {Array.<RegExp>} $buildUtils.SymbolExtractor#defineMatchers
   */

  /**
   * Symbol name must be the first match returned by RegExp#exec()
   * @member {Array.<RegExp>} $buildUtils.SymbolExtractor#referenceMatchers
   */

  /** @ignore */
  defaults: function () {
    this.defineMatchers = this.defineMatchers || [];
    this.referenceMatchers = this.referenceMatchers || [];
  },

  /**
   * @param {Array.<RegExp>} matchers
   * @param {string} text
   * @returns {string[]}
   * @private
   */
  _extractSymbols: function (matchers, text) {
    var symbolLookup = matchers
    .reduce(function (result, defineMatcher) {
      var hits;
      while ((hits = defineMatcher.exec(text)) !== null) {
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
  extractDefinedSymbols: function (scriptBody) {
    return this._extractSymbols(this.defineMatchers, scriptBody);
  },

  /**
   * Extracts symbols that are referenced in the specified script body.
   * @param {string} scriptBody
   * @returns {Array.<string>}
   */
  extractReferencedSymbols: function (scriptBody) {
    return this._extractSymbols(this.referenceMatchers, scriptBody);
  }
})
.build();
