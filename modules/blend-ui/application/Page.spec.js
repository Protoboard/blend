"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Page", function () {
    var Page,
        page;

    beforeAll(function () {
      Page = $oop.getClass('test.$ui.Page.Page')
      .blend($ui.Page);
      Page.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      Page.__instanceLookup = {};
      $ui.Application.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(Page.create()).toBe(Page.create());
    });

    describe("create()", function () {
      it("should initialize nodeName", function () {
        page = Page.create();
        expect(page.nodeName).toBe("page");
      });
    });

    describe("setAsActivePage()", function () {
      var application;

      beforeEach(function () {
        page = Page.create();
        application = $ui.Application.create();
        spyOn(application, 'setActivePage');
      });

      it("should return self", function () {
        var result = page.setAsActivePage();
        expect(result).toBe(page);
      });

      it("should add page to Application as child", function () {
        page.setAsActivePage();
        expect(application.setActivePage).toHaveBeenCalledWith(page);
      });
    });
  });
});
