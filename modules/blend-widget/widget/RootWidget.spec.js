"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("RootWidget", function () {
    var RootWidget,
        rootWidget;

    beforeAll(function () {
      RootWidget = $oop.getClass('test.$widget.RootWidget.RootWidget')
      .blend($widget.RootWidget);
      RootWidget.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize nodeName", function () {
        rootWidget = RootWidget.create();
        expect(rootWidget.nodeName).toBe('root');
      });

      it("should initialize listeningPath", function () {
        rootWidget = RootWidget.create();
        expect(rootWidget.listeningPath).toBe('widget.root');
      });

      it("should initialize triggerPaths", function () {
        rootWidget = RootWidget.create();
        expect(rootWidget.triggerPaths.list).toContain('widget.root', 'widget');
      });
    });
  });
});
