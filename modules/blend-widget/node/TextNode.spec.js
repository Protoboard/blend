"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("TextNode", function () {
    var TextNode,
        textNode;

    beforeAll(function () {
      TextNode = $oop.getClass('test.$widget.TextNode.TextNode')
      .blend($widget.TextNode);
    });

    describe("fromString()", function () {
      it("should create TextNode instance", function () {
        textNode = TextNode.fromString('foo');
        expect(TextNode.mixedBy(textNode)).toBeTruthy();
      });

      it("should set textContent property", function () {
        textNode = TextNode.fromString('foo');
        expect(textNode.textContent).toBe('foo');
      });
    });

    describe("fromTextContent()", function () {
      var stringifiable = {
        toString: function () {
          return 'foo';
        }
      };

      it("should create TextNode instance", function () {
        textNode = TextNode.fromTextContent(stringifiable);
        expect(TextNode.mixedBy(textNode)).toBeTruthy();
      });

      it("should set textContent property", function () {
        textNode = TextNode.fromTextContent(stringifiable);
        expect(textNode.textContent).toBe(stringifiable);
      });
    });

    describe("addChildNode()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').addChildNode($widget.Node.create());
        }).toThrow();
      });
    });

    describe("getChildNode()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').getChildNode('bar');
        }).toThrow();
      });
    });

    describe("getNextChild()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').getNextChild($widget.Node.create());
        }).toThrow();
      });
    });

    describe("getPreviousChild()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').getPreviousChild($widget.Node.create());
        }).toThrow();
      });
    });

    describe("removeChildNode()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').removeChildNode('bar');
        }).toThrow();
      });
    });

    describe("setChildName()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').setChildName($widget.Node.create(), 'bar');
        }).toThrow();
      });
    });

    describe("setChildOrder()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').setChildOrder($widget.Node.create(), 1);
        }).toThrow();
      });
    });

    describe("getAllChildNodes()", function () {
      it("should throw", function () {
        expect(function () {
          TextNode.fromString('foo').getAllChildNodes();
        }).toThrow();
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        textNode = TextNode.fromTextContent({
          toString: function () {
            return 'foo';
          }
        });
      });

      it("should stringify textContent", function () {
        expect(textNode.toString()).toBe('foo');
      });
    });
  });
});
