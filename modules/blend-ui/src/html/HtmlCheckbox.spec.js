"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlCheckbox", function () {
    var HtmlCheckbox,
        htmlCheckbox;

    beforeAll(function () {
      HtmlCheckbox = $oop.createClass('test.$ui.HtmlCheckbox.HtmlCheckbox')
      .blend($ui.Checkbox)
      .blend($ui.HtmlCheckbox)
      .build();
      HtmlCheckbox.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize inputType", function () {
        htmlCheckbox = HtmlCheckbox.create();
        expect(htmlCheckbox.inputType).toBe('checkbox');
      });
    });
  });

  describe("Checkbox", function () {
    var checkbox;

    describe(".create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlCheckbox instance", function () {
          checkbox = $ui.Checkbox.create();
          expect($ui.HtmlCheckbox.mixedBy(checkbox)).toBeTruthy();
        });
      });
    });
  });
});
