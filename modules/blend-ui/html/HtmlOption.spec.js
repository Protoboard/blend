"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlOption", function () {
    var HtmlOption,
        htmlOption;

    beforeAll(function () {
      HtmlOption = $oop.getClass('test.$ui.HtmlOption.HtmlOption')
      .blend($ui.Option)
      .blend($ui.HtmlOption);
      HtmlOption.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should sync 'value' attribute", function () {
        htmlOption = HtmlOption.create({
          ownValue: 'foo'
        });
        expect(htmlOption.getAttribute('value')).toBe('foo');
      });

      it("should sync 'selected' attribute", function () {
        htmlOption = HtmlOption.create({
          state: {
            selected: true
          }
        });
        expect(htmlOption.getAttribute('selected')).toBe('selected');
      });
    });

    describe("setOwnValue()", function () {
      beforeEach(function () {
        htmlOption = HtmlOption.create();
      });

      it("should return self", function () {
        var result = htmlOption.setOwnValue('foo');
        expect(result).toBe(htmlOption);
      });

      it("should sync 'value' attribute", function () {
        htmlOption.setOwnValue('foo');
        expect(htmlOption.getAttribute('value')).toBe('foo');
      });
    });

    describe("select()", function () {
      beforeEach(function () {
        htmlOption = HtmlOption.create();
      });

      it("should return self", function () {
        var result = htmlOption.select();
        expect(result).toBe(htmlOption);
      });

      it("should sync 'selected' attribute", function () {
        htmlOption.select();
        expect(htmlOption.getAttribute('selected')).toBe('selected');
      });
    });
  });

  describe("Option", function () {
    var option;

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should return HtmlOption instance", function () {
          option = $ui.Option.create();
          expect($ui.HtmlOption.mixedBy(option)).toBeTruthy();
        });
      });
    });
  });
});
