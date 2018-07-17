"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe(".escapeXmlEntities()", function () {
    it("should escape characters", function () {
      expect($widget.escapeXmlEntities('"')).toBe('&quot;');
      expect($widget.escapeXmlEntities('\'')).toBe('&apos;');
      expect($widget.escapeXmlEntities('<')).toBe('&lt;');
      expect($widget.escapeXmlEntities('>')).toBe('&gt;');
      expect($widget.escapeXmlEntities('&')).toBe('&amp;');
      expect($widget.escapeXmlEntities('"\'<>&'))
      .toBe('&quot;&apos;&lt;&gt;&amp;');
    });
  });

  describe(".compareNodes()", function () {
    var node1,
        node2,
        node3,
        node4;

    beforeEach(function () {
      node1 = $widget.Node.fromNodeName('foo')
      .setNodeOrder(2);
      node2 = $widget.Node.fromNodeName('bar')
      .setNodeOrder(1);
      node3 = $widget.Node.fromNodeName('baz')
      .setNodeOrder(1);
      node4 = $widget.Node.fromNodeName('bar')
      .setNodeOrder(1);
    });

    describe("when first argument's order is higher", function () {
      it("should return 1", function () {
        expect($widget.compareNodes(node1, node2)).toBe(1);
        expect($widget.compareNodes(node1, node3)).toBe(1);
      });
    });

    describe("when second argument's order is higher", function () {
      it("should return -1", function () {
        expect($widget.compareNodes(node2, node1)).toBe(-1);
        expect($widget.compareNodes(node3, node1)).toBe(-1);
      });
    });

    describe("when orders are equal", function () {
      describe("when first argument's name is higher", function () {
        it("should return 1", function () {
          expect($widget.compareNodes(node3, node2)).toBe(1);
        });
      });

      describe("when second argument's name is higher", function () {
        it("should return -1", function () {
          expect($widget.compareNodes(node2, node3)).toBe(-1);
        });
      });

      describe("when names are equal", function () {
        it("should return 0", function () {
          expect($widget.compareNodes(node2, node4)).toBe(0);
        });
      });
    });
  });
});
