"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("CssClasses", function () {
    var CssClasses,
        cssClasses;

    beforeAll(function () {
      CssClasses = $oop.createClass('test.$widget.CssClasses.CssClasses')
      .blend($widget.CssClasses)
      .build();
    });

    describe("toString()", function () {
      beforeEach(function () {
        cssClasses = CssClasses.fromData({
          foo: 'foo',
          bar: 'bar'
        });
      });

      it("should serialize classes", function () {
        expect(cssClasses + '').toBe('foo bar');
      });
    });
  });
});
