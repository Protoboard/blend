"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("CssClasses", function () {
    var CssClasses,
        cssClasses;

    beforeAll(function () {
      CssClasses = $oop.getClass('test.$widget.CssClasses.CssClasses')
      .blend($widget.CssClasses);
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
