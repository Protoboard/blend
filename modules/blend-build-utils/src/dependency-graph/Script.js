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
  extractExports: function (extractor) {
    return extractor.extractExports(this.body);
  },

  /**
   * @param {$buildUtils.SymbolExtractor} extractor
   * @returns {Array.<string>}
   */
  extractImports: function (extractor) {
    return extractor.extractImports(this.body);
  }
})
.build();
