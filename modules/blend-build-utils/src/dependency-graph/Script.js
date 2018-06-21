"use strict";

/**
 * @function $buildUtils.Script.create
 * @param {Object} [properties]
 * @returns {$buildUtils.Script}
 */

/**
 * @class $buildUtils.Script
 */
$buildUtils.Script = $oop.createClass('$buildUtils.Script')
.define(/** @lends $buildUtils.Script# */{
  /**
   * Script body.
   * @member {string} $buildUtils.Script#body
   */

  /**
   * @memberOf $buildUtils.Script
   * @param {string} body
   * @returns {$buildUtils.Script}
   */
  fromScriptBody: function (body) {
    return this.create({
      body: body
    });
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.body, "Invalid script body");
  },

  /**
   * @param {$buildUtils.SymbolExtractor} extractor
   * @returns {Array.<string>}
   */
  extractDefinedSymbols: function (extractor) {
    return extractor.extractDefinedSymbols(this.body);
  },

  /**
   * @param {$buildUtils.SymbolExtractor} extractor
   * @returns {Array.<string>}
   */
  extractReferencedSymbols: function (extractor) {
    return extractor.extractReferencedSymbols(this.body);
  }
})
.build();
