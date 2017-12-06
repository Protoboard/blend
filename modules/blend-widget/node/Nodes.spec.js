"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("Nodes", function () {
    var Nodes,
        nodes;

    beforeAll(function () {
      Nodes = $oop.createClass('test.$widget.Nodes.Nodes')
      .blend($widget.Nodes)
      .build();
    });

    describe("setItem()", function () {
      var node1, node2, node3;

      beforeEach(function () {
        nodes = Nodes.create();
        node1 = $widget.Node.fromNodeName('foo')
        .setNodeOrder(2);
        node2 = $widget.Node.fromNodeName('bar')
        .setNodeOrder(1);
        node3 = $widget.Node.fromNodeName('baz')
        .setNodeOrder(2);
      });

      it("should add nodes in order", function () {
        nodes
        .setItem(node1)
        .setItem(node2)
        .setItem(node3);

        expect(nodes.data).toEqual([node2, node3, node1]);
      });
    });
  });
});
