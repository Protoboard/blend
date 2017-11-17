"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Page", function () {
    var Page,
        page;

    beforeAll(function () {
      Page = $oop.getClass('test.$widgets.Page.Page')
      .blend($widgets.Page);
      Page.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      Page.__instanceLookup = {};
      $widgets.Application.__instanceLookup = {};
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
        application = $widgets.Application.create();
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
