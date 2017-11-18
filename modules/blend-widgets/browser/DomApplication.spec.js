"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DomApplication", function () {
    var DomApplication,
        domApplication;

    beforeAll(function () {
      DomApplication = $oop.getClass('test.$widgets.DomApplication.DomApplication')
      .blend($widgets.Application)
      .blend($widgets.DomApplication);
      DomApplication.__forwards = {list: [], sources: [], lookup: {}};
      $router.browserRoutingMethod = undefined;
    });

    afterAll(function () {
      $router.browserRoutingMethod = 'hash';
    });

    beforeEach(function () {
      DomApplication.__instanceLookup = {};
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it("should be singleton", function () {
      expect(DomApplication.create()).toBe(DomApplication.create());
    });

    describe("onAttach()", function () {
      beforeEach(function () {
        domApplication = DomApplication.create();
        spyOn(domApplication, 'renderInto');
      });

      it("should render into document.body", function () {
        domApplication.onAttach();
        expect(domApplication.renderInto).toHaveBeenCalledWith(document.body);
      });
    });

    describe("onRouteChange()", function () {
      beforeEach(function () {
        [].toRoute().navigateTo();
        domApplication = DomApplication.create();
        spyOn(domApplication, 'renderInto');
        jasmine.clock().tick(1);
      });

      it("should render into document.body", function () {
        'foo/bar'.toRoute().navigateTo();
        expect(domApplication.renderInto).toHaveBeenCalledWith(document.body);
      });
    });
  });
});
