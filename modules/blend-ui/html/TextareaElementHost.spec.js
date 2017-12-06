"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("TextareaElementHost", function () {
    var TextareaElementHost,
        textareaElementHost;

    beforeAll(function () {
      TextareaElementHost = $oop.createClass('test.$ui.TextareaElementHost.TextareaElementHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.TextareaElementHost)
      .build();
      TextareaElementHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        textareaElementHost = TextareaElementHost.create();
        expect(textareaElementHost.elementName).toBe('textarea');
      });
    });

    describe("getContentMarkup()", function () {
      var stringifiable = {
        toString: function () {
          return "foo";
        }
      };

      beforeEach(function () {
        textareaElementHost = TextareaElementHost.create()
        .setInputValue(stringifiable);
      });

      it("should append textContent to contents", function () {
        expect(textareaElementHost.getContentMarkup()).toBe("foo");
      });

      describe("when textContent has XML markup", function () {
        it("should encode XML entities", function () {
          textareaElementHost.setInputValue("<script>alert('Foo')</script>");
          expect(textareaElementHost.getContentMarkup())
          .toBe("&lt;script&gt;alert(&apos;Foo&apos;)&lt;/script&gt;");
        });
      });
    });
  });
});
