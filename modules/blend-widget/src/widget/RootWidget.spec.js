"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("RootWidget", function () {
    var RootWidget,
        rootWidget;

    beforeAll(function () {
      RootWidget = $oop.createClass('test.$widget.RootWidget.RootWidget')
      .blend($widget.RootWidget)
      .build();
      RootWidget.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      RootWidget.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(RootWidget.create()).toBe(RootWidget.create());
    });

    describe(".create()", function () {
      beforeEach(function () {
        spyOn(RootWidget, 'onAttach');
      });

      it("should initialize nodeName", function () {
        rootWidget = RootWidget.create();
        expect(rootWidget.nodeName).toBe('root');
      });

      it("should initialize listeningPath", function () {
        rootWidget = RootWidget.create();
        expect(rootWidget.listeningPath)
        .toBe('widget.' + rootWidget.instanceId);
      });

      it("should initialize triggerPaths", function () {
        rootWidget = RootWidget.create();
        expect(rootWidget.triggerPaths.list)
        .toContain('widget.' + rootWidget.instanceId, 'widget');
      });

      it("should invoke onAttach()", function () {
        rootWidget = RootWidget.create();
        expect(RootWidget.onAttach).toHaveBeenCalled();
      });
    });
  });
});
