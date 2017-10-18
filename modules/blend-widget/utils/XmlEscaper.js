"use strict";

/**
 * @function $widget.XmlEscaper.create
 * @returns {$widget.XmlEscaper}
 */

/**
 * @class $widget.XmlEscaper
 */
$widget.XmlEscaper = $oop.getClass('$widget.XmlEscaper')
.define(/** @lends $widget.XmlEscaper */{
  /**
   * @type {RegExp}
   * @constant
   */
  RE_XML_ESCAPE_CHARS: /["'<>&]/g,

  /**
   * @param {string} char
   * @returns {string}
   */
  escapeCharacterForXml: function (char) {
    switch (char) {
    case '"':
      return '&quot';
    case '\'':
      return '&apos';
    case '<':
      return '&lt';
    case '>':
      return '&gt';
    case '&':
      return '&amp';
    default:
      return char;
    }
  },

  /**
   * @param {string} string
   * @returns {string}
   */
  escapeXmlEntities: function (string) {
    return string.replace(
        this.RE_XML_ESCAPE_CHARS,
        this.escapeCharacterForXml);
  }
});
