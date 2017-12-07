"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Page", function () {
    var Page,
        page;

    beforeAll(function () {
      Page = $oop.createClass('test.$ui.Page.Page')
      .blend($ui.Page)
      .build();
      Page.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      Page.__builder.instances = {};
      $ui.Application.__builder.instances = {};
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
