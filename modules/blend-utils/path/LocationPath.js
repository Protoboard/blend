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
 * @todo Rename .fromUrlPath() / #toUrlPath to .fromString / #toString once
 * Path has no string manifestation of its own.
 * @todo Add global escape / unescape methods. (See $data.TreePath)
 */
$utils.LocationPath = $oop.getClass('$utils.LocationPath')
.blend($oop.getClass('$utils.Path'))
.define(/** @lends $utils.LocationPath# */{
  /**
   * @memberOf $utils.LocationPath
   * @param {string} urlPath
   * @returns {$utils.LocationPath}
   */
  fromUrlPath: function (urlPath) {
    var components = urlPath.split('/')
    .map(decodeURIComponent);
    return this.create({components: components});
  },

  /**
   * @returns {string}
   */
  toUrlPath: function () {
    return this.components
    .map(encodeURIComponent)
    .join('/');
  }
});
