"use strict";

/**
 * @function $utils.LocationPath.create
 * @param {Object} [properties]
 * @param {string[]} [properties.components] Identifiable 'steps' along the
 * path.
 * @returns {$utils.LocationPath}
 */

/**
 * @class $utils.LocationPath
 * @extends $utils.Path
 * @implements $utils.Stringifiable
 */
$utils.LocationPath = $oop.getClass('$utils.LocationPath')
.blend($oop.getClass('$utils.Path'))
.implement($oop.getClass('$utils.Stringifiable'))
.define(/** @lends $utils.LocationPath# */{
  /**
   * @memberOf $utils.LocationPath
   * @param {string} urlPath
   * @returns {$utils.LocationPath}
   */
  fromString: function (urlPath) {
    var components = urlPath.split($utils.LOCATION_PATH_DELIMITER)
    .map(decodeURIComponent);
    return this.create({components: components});
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.components
    .map(encodeURIComponent)
    .join($utils.LOCATION_PATH_DELIMITER);
  }
});

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Separates LocationPath components.
   * @constant
   */
  LOCATION_PATH_DELIMITER: '/'
});
