"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Application", function () {
    var Application,
        application;

    beforeAll(function () {
      Application = $oop.getClass('test.$widgets.Application.Application')
      .blend($widgets.Application)
      .blend($widgets.Application);
      Application.__forwards = {list: [], sources: [], lookup: {}};
      $router.browserRoutingMethod = undefined;
    });

    afterAll(function () {
      $router.browserRoutingMethod = 'hash';
    });

    beforeEach(function () {
      Application.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(Application.create()).toBe(Application.create());
    });

    describe("setActivePage()", function () {
      var page;

      beforeEach(function () {
        application = Application.create();
        page = $widgets.Page.create();
        spyOn($widgets.PageChangeEvent, 'trigger');
      });

      it("should return self", function () {
        var result = application.setActivePage(page);
        expect(result).toBe(application);
      });

      it("should add page as child", function () {
        application.setActivePage(page);
        expect(application.getChildNode('page')).toBe(page);
      });

      it("should trigger EVENT_PAGE_CHANGE", function () {
        application.setActivePage(page);
        var calls = $widgets.PageChangeEvent.trigger.calls.all(),
            event = calls[0].object;
        expect(event.eventName).toBe('widgets.page.change');
        expect(event.sender).toBe(application);
        expect(event.pageAfter).toBe(page);
        expect(event.pageBefore).toBeUndefined();
      });
    });

    describe("onRouteChange()", function () {
      beforeEach(function () {
        jasmine.clock().install();
        [].toRoute().navigateTo();
        application = Application.create();
        jasmine.clock().tick(1);
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("should set route states", function () {
        'foo/bar'.toRoute().navigateTo();
        expect(application.getStateValue('$router.Route'))
        .toBeTruthy();
        expect(application.getStateValue('route-foo/bar'))
        .toBeTruthy();
      });

      describe("when activeRoute is set", function () {
        it("should remove route states", function () {
          'baz'.toRoute().navigateTo();
          expect(application.getStateValue('route-foo/bar')).toBeFalsy();
          expect(application.getStateValue('route-baz')).toBeTruthy();
        });
      });
    });
  });
});
