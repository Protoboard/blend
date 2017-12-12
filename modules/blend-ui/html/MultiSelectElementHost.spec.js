"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("MultiSelectElementHost", function () {
    var MultiSelectElementHost,
        multiSelectElementHost;

    beforeAll(function () {
      MultiSelectElementHost = $oop.createClass('test.$ui.MultiSelectElementHost.MultiSelectElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.MultiSelectElementHost)
      .build();
      MultiSelectElementHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should add multiple attribute", function () {
        multiSelectElementHost = MultiSelectElementHost.create();
        expect(multiSelectElementHost.getAttribute('multiple'))
        .toBe('multiple');
      });
    });
  });
});
