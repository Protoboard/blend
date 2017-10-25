"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("HtmlWidget", function () {
    var HtmlWidget,
        htmlWidget;

    beforeAll(function () {
      HtmlWidget = $oop.getClass('test.$widget.HtmlWidget.HtmlWidget')
      .blend($widget.Widget)
      .blend($widget.HtmlNode)
      .blend($widget.HtmlWidget);
      HtmlWidget.__forwards = {list: [], sources: {}, lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementId", function () {
        htmlWidget = HtmlWidget.create();
        expect(htmlWidget.elementId).toBe('w' + htmlWidget.instanceId);
      });

      it("should initialize cssClasses", function () {
        htmlWidget = HtmlWidget.create({
          nodeName: 'foo'
        });
        expect($widget.CssClasses.mixedBy(htmlWidget.cssClasses)).toBeTruthy();
        expect(htmlWidget.cssClasses.data).toEqual({
          foo: 1,
          '$widget.Widget': 1,
          '$widget.HtmlWidget': 1
        });
      });
    });
  });
});
