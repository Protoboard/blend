"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("ChildOnlyNode", function () {
    var ChildOnlyNode;

    beforeAll(function () {
      ChildOnlyNode = $oop.getClass('test.$widget.ChildOnlyNode.ChildOnlyNode')
      .blend($widget.ChildOnlyNode);
    });

    describe("addChildNode()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo').addChildNode($widget.Node.create());
        }).toThrow();
      });
    });

    describe("getChildNode()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo').getChildNode('bar');
        }).toThrow();
      });
    });

    describe("getNextChild()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo').getNextChild($widget.Node.create());
        }).toThrow();
      });
    });

    describe("getPreviousChild()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo')
          .getPreviousChild($widget.Node.create());
        }).toThrow();
      });
    });

    describe("removeChildNode()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo').removeChildNode('bar');
        }).toThrow();
      });
    });

    describe("setChildName()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo')
          .setChildName($widget.Node.create(), 'bar');
        }).toThrow();
      });
    });

    describe("setChildOrder()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo')
          .setChildOrder($widget.Node.create(), 1);
        }).toThrow();
      });
    });

    describe("getAllChildNodes()", function () {
      it("should throw", function () {
        expect(function () {
          ChildOnlyNode.fromString('foo').getAllChildNodes();
        }).toThrow();
      });
    });
  });
});
