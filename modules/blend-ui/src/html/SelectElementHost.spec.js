"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("SelectElementHost", function () {
    var SelectElementHost,
        selectElementHost;

    beforeAll(function () {
      SelectElementHost = $oop.createClass('test.$ui.SelectElementHost.SelectElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.SelectElementHost)
      .build();
      SelectElementHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize elementName", function () {
        selectElementHost = SelectElementHost.create();
        expect(selectElementHost.elementName).toBe('select');
      });
    });
  });
});
