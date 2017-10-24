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
      .blend($widget.HtmlWidget);
    });

    describe("create()", function () {
      it("should initialize cssClasses", function () {
        htmlWidget = HtmlWidget.create({
          nodeName: 'foo'
        });
        expect($widget.CssClasses.mixedBy(htmlWidget.cssClasses)).toBeTruthy();
        expect(htmlWidget.cssClasses).toEqual($widget.CssClasses.fromData({
          foo: 1,
          '$widget.Widget': 1,
          '$widget.HtmlWidget': 1,
          'test.$widget.HtmlWidget.HtmlWidget': 1
        }));
      });
    });
  });
});
