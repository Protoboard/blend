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
    });

    describe("create()", function () {
      it("should initialize nodeName", function () {
        node = Node.create();
        expect(node.nodeName).toEqual(String(node.instanceId));
      });

      it("should initialize nodeOrder", function () {
        node = Node.create();
        expect(node.nodeOrder).toBe(0);
      });

      it("should initialize childNodes", function () {
        node = Node.create();
        expect(node.childNodes).toEqual($data.Collection.create());
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

      it("should add node to childNodes", function () {
        node.addChildNode(childNode);
        expect(node.childNodes.getValue('foo')).toBe(childNode);
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
          expect(node.addChildNode.saved.childNodeBefore).toBe(childNode);
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
        expect(node.removeChildNode.saved.childNodeBefore).toBe(childNode);
      });

      it("should remove node from collection", function () {
        node.removeChildNode('foo');
        expect(node.childNodes.getValue('foo')).toBeUndefined();
      });

      it("should invoke removeFromParentNode on childNode", function () {
        node.removeChildNode('foo');
        expect(childNode.removeFromParentNode).toHaveBeenCalled();
      });
    });

    describe("renameChildNode()", function () {
      var childNode;

      beforeEach(function () {
        node = Node.create();
        childNode = Node.create({
          nodeName: 'foo'
        });
        spyOn(childNode, 'setNodeName').and.callThrough();
        node.addChildNode(childNode);
      });

      it("should return self", function () {
        var result = node.renameChildNode(childNode, 'bar');
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.renameChildNode(childNode, 'bar');
        expect(node.renameChildNode.saved.nodeNameBefore).toBe('foo');
      });

      it("should move child node in collection", function () {
        node.renameChildNode(childNode, 'bar');
        expect(node.childNodes.data).toEqual({
          bar: childNode
        });
      });

      it("should invoke setNodeName on childNode", function () {
        node.renameChildNode(childNode, 'bar');
        expect(childNode.setNodeName).toHaveBeenCalledWith('bar');
      });

      describe("when passing non-child node", function () {
        var node2;

        beforeEach(function () {
          node2 = Node.create({
            nodeName: 'baz'
          });
        });

        it("should not change name", function () {
          node.renameChildNode(node2, 'bar');
          expect(node2.nodeName).toBe('baz');
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
        expect(node.addToParentNode.saved.parentNodeBefore).toBeUndefined();
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
        expect(node.removeFromParentNode.saved.parentNodeBefore)
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
      beforeEach(function () {
        node.nodeOrder = 11;
      });

      it("should return self", function () {
        var result = node.setNodeOrder(12);
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.setNodeOrder(12);
        expect(node.setNodeOrder.saved.nodeOrderBefore).toBe(11);
      });

      it("should update nodeName property", function () {
        node.setNodeOrder(12);
        expect(node.nodeOrder).toBe(12);
      });
    });

    describe("setNodeName()", function () {
      var parentNode;

      beforeEach(function () {
        node = Node.create();
        parentNode = Node.create();
        node.nodeName = 'foo';
        parentNode.addChildNode(node);
        spyOn(parentNode, 'renameChildNode').and.callThrough();
      });

      it("should return self", function () {
        var result = node.setNodeName('bar');
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        node.setNodeName('bar');
        expect(node.setNodeName.saved.nodeNameBefore).toBe('foo');
      });

      it("should update nodeName property", function () {
        node.setNodeName('bar');
        expect(node.nodeName).toBe('bar');
      });

      it("should invoke renameChildNode on parentNode", function () {
        node.setNodeName('bar');
        expect(parentNode.renameChildNode).toHaveBeenCalledWith(node, 'bar');
      });
    });

    describe("getNodePath()", function () {
      var node2, node3;

      beforeEach(function () {
        node = Node.create();
        node2 = Node.create();
        node3 = Node.create();
        node.addToParentNode(
            node2.addToParentNode(
                node3));
      });

      it("should retrieve path to node", function () {
        var nodePath = [
          node3.instanceId,
          node2.instanceId,
          node.instanceId
        ]
        .map(String)
        .toPath();

        expect(node.getNodePath()).toEqual(nodePath);
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
