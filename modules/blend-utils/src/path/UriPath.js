"use strict";

/**
 * @function $utils.UriPath.create
 * @param {Object} [properties]
 * @param {string[]} [properties.components] Identifiable 'steps' along the
 * path.
 * @returns {$utils.UriPath}
 */

/**
 * A `Path` representing the "path" component of a Universal Resource
 * Identifier (URI).
 * @class $utils.UriPath
 * @extends $utils.Path
 * @implements $utils.Stringifiable
 */
$utils.UriPath = $oop.createClass('$utils.UriPath')
.blend($utils.Path)
.implement($utils.Stringifiable)
.define(/** @lends $utils.UriPath# */{
  /**
   * @memberOf $utils.UriPath
   * @param {string} urlPath
   * @param {Object} [properties]
   * @returns {$utils.UriPath}
   */
  fromString: function (urlPath, properties) {
    var components = urlPath.split($utils.URI_PATH_DELIMITER)
    .map(decodeURIComponent);
    return this.create({components: components}, properties);
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.components
    .map(encodeURIComponent)
    .join($utils.URI_PATH_DELIMITER);
  }
})
.build();

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Separates UriPath components.
   * @constant
   */
  URI_PATH_DELIMITER: '/'
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$data.TreePath}
   */
  toUriPath: function (properties) {
    return $utils.UriPath.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$data.TreePath}
   */
  toUriPath: function (properties) {
    return $utils.UriPath.create({components: this}, properties);
  }
});
