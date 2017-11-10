"use strict";

/**
 * @function $api.LocationPath.create
 * @param {Object} [properties]
 * @param {string[]} [properties.components] Identifiable 'steps' along the
 * path.
 * @returns {$api.LocationPath}
 */

/**
 * @class $api.LocationPath
 * @extends $data.TreePath
 * @todo Move to $utils, or an intermediate module.
 * @todo Rename .fromUrlPath() / #toUrlPath to .fromString / #toString once
 * Path has no string manifestation of its own.
 */
$api.LocationPath = $oop.getClass('$api.LocationPath')
.blend($data.TreePath)
.define(/** @lends $api.LocationPath# */{
  /**
   * @memberOf $api.LocationPath
   * @param {string} urlPath
   * @returns {$api.LocationPath}
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
