"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("SingleSelect", function () {
    var SingleSelect,
        singleSelect;

    beforeAll(function () {
      SingleSelect = $oop.getClass('test.$ui.HtmlSingleSelect.SingleSelect')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.SingleSelect);
    });

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should create instance", function () {
          singleSelect = SingleSelect.create();
          expect($ui.HtmlSingleSelect.mixedBy(singleSelect)).toBeTruthy();
        });
      });
    });
  });
});
