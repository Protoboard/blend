"use strict";

/**
 * @function $utils.UriPathPattern.create
 * @param {Object} [properties]
 * @param {string[]} properties.components Series of patterns to match
 * corresponding path components.
 * @returns {$utils.UriPathPattern}
 */

/**
 * @class $utils.UriPathPattern
 * @extends $utils.PathPattern
 * @implements $utils.Stringifiable
 */
$utils.UriPathPattern = $oop.createClass('$utils.UriPathPattern')
.blend($utils.PathPattern)
.implement($utils.Stringifiable)
.define(/** @lends $utils.UriPathPattern# */{
  /**
   * @memberOf $utils.UriPathPattern
   * @param {string} uriPathPattern
   * @param {Object} [properties]
   * @returns {$utils.UriPathPattern}
   */
  fromString: function (uriPathPattern, properties) {
    var components = $utils.safeSplit(uriPathPattern, $utils.URI_PATH_DELIMITER);
    return this.create({components: components}, properties);
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.components
    .map(String)
    .map($utils.escapeUriPathDelimiter)
    .join($utils.URI_PATH_DELIMITER);
  }
})
.build();

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * @param {string} uriPath
   * @returns {string}
   */
  escapeUriPathDelimiter: function (uriPath) {
    return $utils.escape(uriPath, $utils.URI_PATH_DELIMITER);
  },

  /**
   * @param {string} uriPath
   * @returns {string}
   */
  unescapeUriPathDelimiter: function (uriPath) {
    return $utils.unescape(uriPath, $utils.URI_PATH_DELIMITER);
  }
});
