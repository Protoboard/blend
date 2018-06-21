"use strict";

/**
 * @function $buildUtils.BlendSymbolExtractor.create
 * @param {Object} [properties]
 * @returns {$buildUtils.BlendSymbolExtractor}
 */

/**
 * Symbol extractor for blend classes.
 * @class $buildUtils.BlendSymbolExtractor
 * @extends $buildUtils.SymbolExtractor
 */
$buildUtils.BlendSymbolExtractor = $oop.createClass('$buildUtils.BlendSymbolExtractor')
.blend($buildUtils.SymbolExtractor)
.define(/** @lends $buildUtils.BlendSymbolExtractor# */{
  /** @ignore */
  spread: function () {
    this.exportMatchers = this.exportMatchers.concat([
      /\.createClass\s*\(\s*['"]([$._\w\d]+)['"]\s*\)/g
    ]);

    this.importMatchers = this.importMatchers.concat([
      /\.(?:mix|blend|expect|implement)\s*\(\s*([$._\w\d]+)\s*\)/g,
      /([$._\w\d]+)(?=\.(?:forwardBlend|delegate))/g
    ]);
  }
})
.build();
