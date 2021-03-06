"use strict";

/**
 * @class $widget.XmlEscaper
 */
$widget.XmlEscaper = $oop.createClass('$widget.XmlEscaper')
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
      return '&quot;';
    case '\'':
      return '&apos;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '&':
      return '&amp;';
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
})
.build();
