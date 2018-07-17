"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Application", function () {
    var Application,
        application;

    beforeAll(function () {
      Application = $oop.createClass('test.$ui.Application.Application')
      .blend($ui.Application)
      .blend($ui.Application)
      .build();
      Application.__builder.forwards = {list: [], lookup: {}};
      $router.browserRoutingMethod = undefined;
    });

    afterAll(function () {
      $router.browserRoutingMethod = 'hash';
    });

    beforeEach(function () {
      Application.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(Application.create()).toBe(Application.create());
    });

    describe("#setActivePage()", function () {
      var page;

      beforeEach(function () {
        application = Application.create();
        page = $ui.Page.create();
        spyOn($ui.PageChangeEvent, 'trigger');
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
        var calls = $ui.PageChangeEvent.trigger.calls.all(),
            event = calls[0].object;
        expect(event.eventName).toBe('ui.page.change');
        expect(event.sender).toBe(application);
        expect(event.pageAfter).toBe(page);
        expect(event.pageBefore).toBeUndefined();
      });
    });

    describe("#onRouteChange()", function () {
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
