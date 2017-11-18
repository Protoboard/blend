"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("Node", function () {
    var Node,
        node;

    beforeAll(function () {
      Node = $oop.getClass('test.$widget.Node.Node')
      .blend($widget.Node);
      Node.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromNodeName()", function () {
      it("should return Node instance", function () {
        node = Node.fromNodeName('foo');
        expect(Node.mixedBy(node)).toBeTruthy();
      });

      it("should initialize nodeName", function () {
        node = Node.fromNodeName('foo');
        expect(node.nodeName).toBe('foo');
      });

      it("should pass additional properties to create", function () {
        node = Node.fromNodeName('foo', {bar: 'baz'});
        expect(node.bar).toBe('baz');
      });
    });

    describe("create()", function () {
      it("should initialize nodeName", function () {
        node = Node.create();
        expect(node.nodeName).toEqual(String(node.instanceId));
      });

      it("should initialize nodeOrder", function () {
        node = Node.create();
        expect(node.nodeOrder).toBe(node.instanceId);
      });

      it("should initialize childNodeLookup", function () {
        node = Node.create();
        expect(node.childNodeLookup).toEqual($data.Collection.create());
      });
    });

    describe("addChildNode()", function () {
      var childNode;

      beforeEach(function () {
        node = Node.create();
        childNode = Node.create({
          nodeName: 'foo'
        });
        spyOn(childNode, 'addToParentNode').and.callThrough();
      });

      it("should return self", function () {
        var result = node.addChildNode(childNode);
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.addChildNode(childNode);
        expect(node.addChildNode.childNodeBefore).toBeUndefined();
      });

      it("should add node to childNodeLookup", function () {
        node.addChildNode(childNode);
        expect(node.childNodeLookup.getValue('foo')).toBe(childNode);
      });

      it("should add node to childNodes", function () {
        node.addChildNode(childNode);
        expect(node.childNodes.data).toEqual([childNode]);
      });

      it("should invoke addToParentNode on childNode", function () {
        node.addChildNode(childNode);
        expect(childNode.addToParentNode).toHaveBeenCalledWith(node);
      });

      describe("when child already has parent", function () {
        var parentNodeBefore;

        beforeEach(function () {
          node.addChildNode(childNode);
          spyOn(Node, 'removeChildNode');
          parentNodeBefore = Node.create();
        });

        it("should remove child from previous parent", function () {
          node.addChildNode(Node.create({
            nodeName: 'bar',
            parentNode: parentNodeBefore
          }));
          var calls = Node.removeChildNode.calls.all();
          expect(calls[0].object).toBe(parentNodeBefore);
          expect(calls[0].args).toEqual(['bar']);
        });
      });

      describe("when node already has child by same name", function () {
        beforeEach(function () {
          node.addChildNode(childNode);
          spyOn(Node, 'removeChildNode');
          node.addChildNode(Node.create({
            nodeName: 'foo'
          }));
        });

        it("should save before state", function () {
          expect(node.addChildNode.shared.childNodeBefore).toBe(childNode);
        });

        it("should remove child", function () {
          var calls = Node.removeChildNode.calls.all();
          expect(calls[0].object).toBe(node);
          expect(calls[0].args).toEqual(['foo']);
        });
      });
    });

    describe("getChildNode()", function () {
      var childNode;

      beforeEach(function () {
        node = Node.create();
        childNode = Node.create({
          nodeName: 'foo'
        });
        node.addChildNode(childNode);
      });

      it("should retrieve specified child node", function () {
        expect(node.getChildNode('foo')).toBe(childNode);
      });

      describe("when no child node matches name", function () {
        it("should return undefined", function () {
          expect(node.getChildNode('bar')).toBeUndefined();
        });
      });
    });

    describe("getNextChild()", function () {
      var childNode1,
          childNode2;

      beforeEach(function () {
        childNode1 = Node.create()
        .setNodeOrder(1);
        childNode2 = Node.create()
        .setNodeOrder(2);
        node = Node.create()
        .addChildNode(childNode1)
        .addChildNode(childNode2);
      });

      it("should retrieve next child", function () {
        expect(node.getNextChild(childNode1)).toBe(childNode2);
      });

      describe("for last child", function () {
        it("should return undefined", function () {
          expect(node.getNextChild(childNode2)).toBeUndefined();
        });
      });

      describe("for non-child node", function () {
        it("should return undefined", function () {
          expect(node.getNextChild(Node.create())).toBeUndefined();
        });
      });
    });

    describe("getPreviousChild()", function () {
      var childNode1,
          childNode2;

      beforeEach(function () {
        childNode1 = Node.create()
        .setNodeOrder(1);
        childNode2 = Node.create()
        .setNodeOrder(2);
        node = Node.create()
        .addChildNode(childNode1)
        .addChildNode(childNode2);
      });

      it("should retrieve previous child", function () {
        expect(node.getPreviousChild(childNode2)).toBe(childNode1);
      });

      describe("for first child", function () {
        it("should return undefined", function () {
          expect(node.getPreviousChild(childNode1)).toBeUndefined();
        });
      });

      describe("for non-child node", function () {
        it("should return undefined", function () {
          expect(node.getPreviousChild(Node.create())).toBeUndefined();
        });
      });
    });

    describe("removeChildNode()", function () {
      var childNode;

      beforeEach(function () {
        node = Node.create();
        childNode = Node.create({
          nodeName: 'foo'
        });
        node.addChildNode(childNode);
        spyOn(childNode, 'removeFromParentNode').and.callThrough();
      });

      it("should return self", function () {
        var result = node.removeChildNode('foo');
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.removeChildNode('foo');
        expect(node.removeChildNode.shared.childNodeBefore).toBe(childNode);
      });

      it("should remove node from childNodeLookup", function () {
        node.removeChildNode('foo');
        expect(node.childNodeLookup.getValue('foo')).toBeUndefined();
      });

      it("should remove node from childNodes", function () {
        node.removeChildNode('foo');
        expect(node.childNodes.data).toEqual([]);
      });

      it("should invoke removeFromParentNode on childNode", function () {
        node.removeChildNode('foo');
        expect(childNode.removeFromParentNode).toHaveBeenCalled();
      });
    });

    describe("setChildOrder()", function () {
      var childNode,
          childNode2;

      beforeEach(function () {
        node = Node.create();
        childNode = Node.create({
          nodeName: 'foo'
        });
        childNode2 = Node.create({
          nodeOrder: 1
        });
        spyOn(childNode, 'setNodeOrder').and.callThrough();

        node
        .addChildNode(childNode2)
        .addChildNode(childNode);
      });

      it("should return self", function () {
        var result = node.setChildOrder(childNode, 2);
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.setChildOrder(childNode, 2);
        expect(node.setChildOrder.shared.nodeOrderBefore)
        .toBe(childNode.instanceId);
      });

      it("should move child node in childNodes", function () {
        node.setChildOrder(childNode, 2);
        expect(node.childNodes.data).toEqual([
          childNode2, childNode
        ]);
      });

      it("should invoke setNodeOrder on childNode", function () {
        node.setChildOrder(childNode, 2);
        expect(childNode.setNodeOrder).toHaveBeenCalledWith(2);
      });

      describe("when passing non-child node", function () {
        var node2;

        beforeEach(function () {
          node2 = Node.create({
            nodeName: 'foo',
            nodeOrder: 1
          });
        });

        it("should not change name", function () {
          node.setChildOrder(node2, 2);
          expect(node2.nodeOrder).toBe(1);
        });
      });
    });

    describe("addToParentNode()", function () {
      var parentNode;

      beforeEach(function () {
        node = Node.create();
        parentNode = Node.create();
        spyOn(parentNode, 'addChildNode');
      });

      it("should return self", function () {
        var result = node.addToParentNode(parentNode);
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.addToParentNode(parentNode);
        expect(node.addToParentNode.shared.parentNodeBefore).toBeUndefined();
      });

      it("should set parentNode property", function () {
        node.addToParentNode(parentNode);
        expect(node.parentNode).toBe(parentNode);
      });

      it("should invoke addChildNode on parent", function () {
        node.addToParentNode(parentNode);
        expect(parentNode.addChildNode).toHaveBeenCalledWith(node);
      });
    });

    describe("removeFromParentNode()", function () {
      var parentNode;

      beforeEach(function () {
        node = Node.create({nodeName: 'foo'});
        parentNode = Node.create()
        .addChildNode(node);
        spyOn(parentNode, 'removeChildNode');
      });

      it("should return self", function () {
        var result = node.removeFromParentNode();
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.removeFromParentNode();
        expect(node.removeFromParentNode.shared.parentNodeBefore)
        .toBe(parentNode);
      });

      it("should reset parentNode property", function () {
        node.removeFromParentNode();
        expect(node.parentNode).toBeUndefined();
      });

      it("should invoke addChildNode on parent", function () {
        node.removeFromParentNode();
        expect(parentNode.removeChildNode).toHaveBeenCalledWith('foo');
      });
    });

    describe("setNodeOrder()", function () {
      var parentNode;

      beforeEach(function () {
        node = Node.create();
        parentNode = Node.create();
        node.nodeOrder = 11;
        parentNode.addChildNode(node);
        spyOn(parentNode, 'setChildOrder').and.callThrough();
      });

      it("should return self", function () {
        var result = node.setNodeOrder(12);
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.setNodeOrder(12);
        expect(node.setNodeOrder.shared.nodeOrderBefore).toBe(11);
      });

      it("should update nodeName property", function () {
        node.setNodeOrder(12);
        expect(node.nodeOrder).toBe(12);
      });

      it("should invoke setChildOrder on parentNode", function () {
        node.setNodeOrder(12);
        expect(parentNode.setChildOrder).toHaveBeenCalledWith(node, 12);
      });
    });

    describe("getNextSibling()", function () {
      var parentNode,
          childNode1,
          childNode2,
          detachedNode;

      beforeEach(function () {
        childNode1 = Node.create()
        .setNodeOrder(1);
        childNode2 = Node.create()
        .setNodeOrder(3);
        detachedNode = Node.create();
        parentNode = Node.create()
        .addChildNode(childNode1)
        .addChildNode(childNode2);
      });

      it("should retrieve next child", function () {
        expect(childNode1.getNextSibling()).toBe(childNode2);
      });

      describe("for last child", function () {
        it("should return undefined", function () {
          expect(childNode2.getNextSibling()).toBeUndefined();
        });
      });

      describe("for detached node", function () {
        it("should return undefined", function () {
          expect(detachedNode.getNextSibling()).toBeUndefined();
        });
      });
    });

    describe("getPreviousSibling()", function () {
      var parentNode,
          childNode1,
          childNode2,
          detachedNode;

      beforeEach(function () {
        childNode1 = Node.create()
        .setNodeOrder(1);
        childNode2 = Node.create()
        .setNodeOrder(3);
        detachedNode = Node.create();
        parentNode = Node.create()
        .addChildNode(childNode1)
        .addChildNode(childNode2);
      });

      it("should retrieve next child", function () {
        expect(childNode2.getPreviousSibling()).toBe(childNode1);
      });

      describe("for last child", function () {
        it("should return undefined", function () {
          expect(childNode1.getPreviousSibling()).toBeUndefined();
        });
      });

      describe("for detached node", function () {
        it("should return undefined", function () {
          expect(detachedNode.getPreviousSibling()).toBeUndefined();
        });
      });
    });

    describe("getNodePath()", function () {
      var node2, node3;

      beforeEach(function () {
        node = Node.fromNodeName('foo');
        node2 = Node.fromNodeName('bar');
        node3 = Node.fromNodeName('baz');
        node.addChildNode(
            node2.addChildNode(
                node3));
      });

      it("should retrieve path to node", function () {
        var result = node3.getNodePath();
        expect($data.TreePath.mixedBy(result)).toBeTruthy();
        expect(result).toEqual('foo.bar.baz'.toTreePath());
      });
    });

    describe("getParentNodes()", function () {
      var node2, node3;

      beforeEach(function () {
        node = Node.create();
        node2 = Node.create();
        node3 = Node.create();
        node.addToParentNode(
            node2.addToParentNode(
                node3));
      });

      it("should retrieve array of parent nodes", function () {
        expect(node.getParentNodes()).toEqual([node2, node3]);
      });
    });

    describe("getClosestParentNode()", function () {
      var node2, node3, node4;

      beforeEach(function () {
        node = Node.create();
        node2 = Node.create({
          nodeName: 'foo'
        });
        node3 = Node.create({
          nodeName: 'bar'
        });
        node4 = Node.create({
          nodeName: 'foo'
        });
        node.addToParentNode(
            node2.addToParentNode(
                node3));
      });

      it("should retrieve first node that matches filter", function () {
        var filter = function (node) {
          return node && node.nodeName === 'foo';
        };
        expect(node.getClosestParentNode(filter)).toBe(node2);
      });
    });

    describe("getAllChildNodes()", function () {
      var node1, node2, node3, node4;

      beforeEach(function () {
        node = Node.create();
        node1 = Node.create();
        node2 = Node.create();
        node3 = Node.create();
        node4 = Node.create();

        node.addChildNode(
            node1.addChildNode(
                node2.addChildNode(
                    node4))
            .addChildNode(node3));
      });

      it("should retrieve list of all child nodes", function () {
        expect(node.getAllChildNodes()).toEqual([
          node1, node2, node4, node3
        ]);
      });
    });
  });
});
