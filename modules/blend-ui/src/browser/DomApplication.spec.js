"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomApplication", function () {
    var DomApplication,
        domApplication;

    beforeAll(function () {
      DomApplication = $oop.createClass('test.$ui.DomApplication.DomApplication')
      .blend($ui.Application)
      .blend($ui.DomApplication)
      .build();
      DomApplication.__builder.forwards = {list: [], lookup: {}};
      $router.browserRoutingMethod = undefined;
    });

    afterAll(function () {
      $router.browserRoutingMethod = 'hash';
    });

    beforeEach(function () {
      DomApplication.__builder.instances = {};
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it("should be singleton", function () {
      expect(DomApplication.create()).toBe(DomApplication.create());
    });

    describe("#onAttach()", function () {
      beforeEach(function () {
        domApplication = DomApplication.create();
        spyOn(domApplication, 'renderInto');
        spyOn(domApplication, 'getElement').and.returnValue(null);
      });

      it("should render into document.body", function () {
        domApplication.onAttach();
        expect(domApplication.renderInto).toHaveBeenCalledWith(document.body);
      });
    });

    describe("#onRouteChange()", function () {
      beforeEach(function () {
        [].toRoute().navigateTo();
        domApplication = DomApplication.create();
        spyOn(domApplication, 'renderInto');
        spyOn(domApplication, 'getElement').and.returnValue(null);
        jasmine.clock().tick(1);
      });

      it("should render into document.body", function () {
        'foo/bar'.toRoute().navigateTo();
        expect(domApplication.renderInto).toHaveBeenCalledWith(document.body);
      });
    });
  });
});
