"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("Widget", function () {
    var Widget,
        widget;

    beforeAll(function () {
      Widget = $oop.getClass('test.$widget.Widget.Widget')
      .blend($widget.Widget);
    });

    describe("create()", function () {
      it("should initialize elementId", function () {
        widget = Widget.create();
        expect(widget.elementId).toBe('w' + widget.instanceId);
      });

      it("should initialize nodeName", function () {
        widget = Widget.create();
        expect(widget.nodeName).toBe(String(widget.instanceId));
      });

      it("should initialize subscriberId", function () {
        widget = Widget.create();
        expect(widget.subscriberId).toBe('w' + widget.instanceId);
      });

      it("should initialize elementName", function () {
        widget = Widget.create();
        expect(widget.elementName).toBe('div');
      });

      it("should initialize cssClasses", function () {
        widget = Widget.create({
          nodeName: 'foo'
        });
        expect($widget.CssClasses.mixedBy(widget.cssClasses)).toBeTruthy();
        expect(widget.cssClasses).toEqual($widget.CssClasses.fromData({
          foo: 1,
          '$widget.Widget': 1
        }));
      });
    });
  });
});
