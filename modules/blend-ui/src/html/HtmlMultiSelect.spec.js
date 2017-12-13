"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("MultiSelect", function () {
    var MultiSelect,
        multiSelect;

    beforeAll(function () {
      MultiSelect = $oop.createClass('test.$ui.HtmlMultiSelect.MultiSelect')
      .blend($widget.Widget)
      .blend($ui.InputValuesHost)
      .blend($ui.MultiSelect)
      .build();
    });

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should create instance", function () {
          multiSelect = MultiSelect.create();
          expect($ui.HtmlMultiSelect.mixedBy(multiSelect)).toBeTruthy();
        });
      });
    });
  });
});
