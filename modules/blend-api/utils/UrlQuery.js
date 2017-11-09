"use strict";

/**
 * @function $api.UrlQuery.create
 * @param {Object} [properties]
 * @param {object|Array} [properties.data]
 * @returns {$api.UrlQuery}
 */

/**
 * @class $api.UrlQuery
 * @extends $data.StringDictionary
 */
$api.UrlQuery = $oop.getClass('$api.UrlQuery')
.blend($data.Dictionary)
.define(/** @lends $api.UrlQuery# */{
  /**
   * @memberOf $api.UrlQuery
   * @param {string} urlQueryStr
   * @returns {$api.UrlQuery}
   */
  fromString: function (urlQueryStr) {
    var data = urlQueryStr
    .split('&')
    .map(function (attributeValuePairStr) {
      return attributeValuePairStr
      .split("=")
      .map(decodeURIComponent);
    })
    .reduce(function (data, attributeValuePair) {
      var attributeName = attributeValuePair[0],
          attributeValue = attributeValuePair[1],
          attributeValues = data[attributeName];
      if (!attributeValues) {
        data[attributeName] = [attributeValue];
      } else {
        attributeValues.push(attributeValue);
      }
      return data;
    }, {});
    return this.create({data: data});
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this
    .toPairList()
    .data
    .map(function (attributeValuePair) {
      return encodeURIComponent(attributeValuePair.key) + '=' +
          encodeURIComponent(attributeValuePair.value);
    })
    .join('&');
  }
});
