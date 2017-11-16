"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("XmlAttributes", function () {
    var XmlAttributes,
        attributes;

    beforeAll(function () {
      XmlAttributes = $oop.getClass('test.$widget.XmlAttributes.XmlAttributes')
      .blend($widget.XmlAttributes);
    });

    describe("toString()", function () {
      beforeEach(function () {
        attributes = XmlAttributes.fromData({
          hello: "world",
          foo: "bar"
        });
      });

      it("should serialize attributes", function () {
        expect(attributes.toString()).toBe("foo=\"bar\" hello=\"world\"");
      });

      describe("when attributes contain XML entities", function () {
        beforeEach(function () {
          attributes = XmlAttributes.fromData({
            '<hello>': "\"world\"",
            '&foo': "'bar'"
          });
        });

        it("should escape XML entities", function () {
          expect(attributes.toString()).toBe("&amp;foo=\"&apos;bar&apos;\"" +
              " &lt;hello&gt;=\"&quot;world&quot;\"");
        });
      });
    });
  });
});
