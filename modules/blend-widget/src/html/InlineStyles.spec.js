"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("InlineStyles", function () {
    var InlineStyles,
        inlineStyles;

    beforeAll(function () {
      InlineStyles = $oop.createClass('test.$widget.InlineStyles.InlineStyles')
      .blend($widget.InlineStyles)
      .build();
    });

    describe("#toString()", function () {
      beforeEach(function () {
        inlineStyles = InlineStyles.fromData({
          width: "10px",
          height: "1em"
        });
      });

      it("should serialize styles", function () {
        expect(inlineStyles + '').toBe("width:10px;height:1em");
      });
    });
  });
});
