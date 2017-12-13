"use strict";

/**
 * @function $widget.XmlAttributes.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$widget.XmlAttributes}
 */

/**
 * @class $widget.XmlAttributes
 * @extends $data.Collection
 * @implements $utils.Stringifiable
 */
$widget.XmlAttributes = $oop.createClass('$widget.XmlAttributes')
.blend($data.Collection)
.implement($utils.Stringifiable)
.define(/** @lends $widget.XmlAttributes# */{
  /** @returns {string} */
  toString: function () {
    return this
    .mapValues(function (attributeValue, attributeName) {
      return $widget.escapeXmlEntities(attributeName) + '=' +
          '"' + $widget.escapeXmlEntities(attributeValue) + '"';
    })
    .getValues()
    .sort()
    .join(' ');
  }
})
.build();
