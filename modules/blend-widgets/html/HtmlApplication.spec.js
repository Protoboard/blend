"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("HtmlApplication", function () {
    var HtmlApplication,
        htmlApplication;

    beforeAll(function () {
      HtmlApplication = $oop.getClass('test.$widgets.HtmlApplication.HtmlApplication')
      .blend($widgets.HtmlApplication);
      HtmlApplication.__forwards = {list: [], sources: [], lookup: {}};
      $router.browserRoutingMethod = undefined;
    });

    afterAll(function () {
      $router.browserRoutingMethod = 'hash';
    });

    beforeEach(function () {
      HtmlApplication.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(HtmlApplication.create()).toBe(HtmlApplication.create());
    });

    describe("syncToActiveRoute()", function () {
      beforeEach(function () {
        htmlApplication = HtmlApplication.create();
      });

      it("should add route CSS classes", function () {
        'foo/bar'.toRoute().navigateTo();
        expect(htmlApplication.cssClasses.hasItem('route-foo/bar'))
        .toBeTruthy();
      });

      describe("when activeRoute is set", function () {
        it("should remove associated CSS classes", function () {
          'baz'.toRoute().navigateTo();
          expect(htmlApplication.cssClasses.hasItem('route-foo/bar'))
          .toBeFalsy();
          expect(htmlApplication.cssClasses.hasItem('route-baz')).toBeTruthy();
        });
      });
    });
  });

  describe("Application", function () {
    var application;

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should return HtmlApplication instance", function () {
          application = $widgets.Application.create();
          expect($widgets.HtmlApplication.mixedBy(application)).toBeTruthy();
        });
      });
    });
  });
});
