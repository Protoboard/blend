"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("XmlEscaper", function () {
    describe("escapeXmlEntities()", function () {
      it("should escape characters", function () {
        expect($widget.XmlEscaper.escapeXmlEntities('"')).toBe('&quot;');
        expect($widget.XmlEscaper.escapeXmlEntities('\'')).toBe('&apos;');
        expect($widget.XmlEscaper.escapeXmlEntities('<')).toBe('&lt;');
        expect($widget.XmlEscaper.escapeXmlEntities('>')).toBe('&gt;');
        expect($widget.XmlEscaper.escapeXmlEntities('&')).toBe('&amp;');
        expect($widget.XmlEscaper.escapeXmlEntities('"\'<>&'))
        .toBe('&quot;&apos;&lt;&gt;&amp;');
      });
    });
  });
});
