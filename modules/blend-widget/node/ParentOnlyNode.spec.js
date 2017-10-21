"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("ParentOnlyNode", function () {
    var ParentOnlyNode;

    beforeAll(function () {
      ParentOnlyNode = $oop.getClass('test.$widget.ParentOnlyNode.ParentOnlyNode')
      .blend($widget.ParentOnlyNode);
    });

    describe("addToParentNode()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo')
          .addToParentNode($widget.Node.create());
        }).toThrow();
      });
    });

    describe("removeFromParentNode()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo').removeFromParentNode();
        }).toThrow();
      });
    });

    describe("setNodeOrder()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo').setNodeOrder(1);
        }).toThrow();
      });
    });

    describe("getNextSibling()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo').getNextSibling();
        }).toThrow();
      });
    });

    describe("getPreviousSibling()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo').getPreviousSibling();
        }).toThrow();
      });
    });

    describe("getParentNodes()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo').getParentNodes();
        }).toThrow();
      });
    });

    describe("getClosestParentNode()", function () {
      it("should throw", function () {
        expect(function () {
          ParentOnlyNode.fromString('foo').getClosestParentNode();
        }).toThrow();
      });
    });
  });
});
