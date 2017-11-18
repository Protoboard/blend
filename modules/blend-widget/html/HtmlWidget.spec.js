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
      HtmlWidget.__forwards = {list: [], sources: [], lookup: {}};
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
          '$widget.HtmlWidget': 1,
          'test.$widget.HtmlWidget.HtmlWidget': 1
        });
      });
    });

    describe("setNodeName()", function () {
      beforeEach(function () {
        htmlWidget = HtmlWidget.create({
          nodeName: 'foo'
        });
      });

      it("should return self", function () {
        var result = htmlWidget.setNodeName('bar');
        expect(result).toBe(htmlWidget);
      });

      it("should remove CSS class for old nodeName", function () {
        htmlWidget.setNodeName('bar');
        expect(htmlWidget.hasCssClass('foo')).toBeFalsy();
      });

      it("should add CSS class for new nodeName", function () {
        htmlWidget.setNodeName('bar');
        expect(htmlWidget.hasCssClass('bar')).toBeTruthy();
      });
    });
  });

  describe("Widget", function () {
    var widget;

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return HtmlWidget instance", function () {
          widget = $widget.Widget.create();
          expect($widget.HtmlWidget.mixedBy(widget)).toBeTruthy();
        });
      });
    });
  });
});
