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

    describe("onRouteChange()", function () {
      beforeEach(function () {
        application = Application.create();
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
