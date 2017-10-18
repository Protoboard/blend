"use strict";

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * @param {string} string
   * @returns {string}
   */
  escapeXmlEntities: function (string) {
    return $widget.XmlEscaper.escapeXmlEntities(string);
  }
});
