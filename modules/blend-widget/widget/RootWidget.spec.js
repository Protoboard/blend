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

    beforeEach(function () {
      RootWidget.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(RootWidget.create()).toBe(RootWidget.create());
    });

    describe("create()", function () {
      beforeEach(function () {
        spyOn(RootWidget, 'onAttach');
      });

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

      it("should invoke onAttach()", function () {
        rootWidget = RootWidget.create();
        expect(RootWidget.onAttach).toHaveBeenCalled();
      });
    });
  });
});
