"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("TextContentHost", function () {
    var TextContentHost,
        textContentHost;

    beforeAll(function () {
      TextContentHost = $oop.getClass('test.$ui.TextContentHost.TextContentHost')
      .blend($ui.Text)
      .blend($ui.TextContentHost);
      TextContentHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("getContentMarkup()", function () {
      var stringifiable = {
        toString: function () {
          return "foo";
        }
      };

      beforeEach(function () {
        textContentHost = TextContentHost.fromElementName('span')
        .setTextString(stringifiable);
      });

      it("should append textContent to contents", function () {
        expect(textContentHost.getContentMarkup()).toBe("foo");
      });

      describe("when textContent has XML markup", function () {
        it("should encode XML entities", function () {
          textContentHost.setTextString("<script>alert('Foo')</script>");
          expect(textContentHost.getContentMarkup())
          .toBe("&lt;script&gt;alert(&apos;Foo&apos;)&lt;/script&gt;");
        });
      });
    });
  });
});
