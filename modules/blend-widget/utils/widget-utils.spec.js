"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("escapeXmlEntities()", function () {
    it("should escape characters", function () {
      expect($widget.escapeXmlEntities('"')).toBe('&quot');
      expect($widget.escapeXmlEntities('\'')).toBe('&apos');
      expect($widget.escapeXmlEntities('<')).toBe('&lt');
      expect($widget.escapeXmlEntities('>')).toBe('&gt');
      expect($widget.escapeXmlEntities('&')).toBe('&amp');
      expect($widget.escapeXmlEntities('"\'<>&'))
      .toBe('&quot&apos&lt&gt&amp');
    });
  });
});
