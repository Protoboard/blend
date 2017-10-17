"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $widget = window['cake-widget'];

describe("$widget", function () {
  describe("Node", function () {
    var Node,
        node,
        result;

    beforeAll(function () {
      Node = $oop.getClass('test.$widget.Node.Node')
      .blend($widget.Node);
    });

    beforeEach(function () {
      node = Node.create();
    });

    describe("create()", function () {
      it("should initialize nodeName", function () {
        expect(node.nodeName).toEqual(String(node.instanceId));
      });

      it("should initialize childNodes", function () {
        expect(node.childNodes).toEqual($data.Collection.create());
      });
    });

    describe("addChildNode()", function () {
      var childNode;

      beforeEach(function () {
        childNode = Node.create({
          nodeName: 'foo'
        });
        spyOn(childNode, 'addToParentNode').and.callThrough();
        result = node.addChildNode(childNode);
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        expect(node.addChildNode.childNodeBefore).toBeUndefined();
      });

      it("should add node to childNodes", function () {
        expect(node.childNodes.getValue('foo')).toBe(childNode);
      });

      it("should invoke addToParentNode on childNode", function () {
        expect(childNode.addToParentNode).toHaveBeenCalledWith(node);
      });

      describe("when child already has parent", function () {
        var parentNodeBefore;

        beforeEach(function () {
          spyOn(Node, 'removeChildNode');
          parentNodeBefore = Node.create();
          node.addChildNode(Node.create({
            nodeName: 'bar',
            parentNode: parentNodeBefore
          }));
        });

        it("should remove child from previous parent", function () {
          var calls = Node.removeChildNode.calls.all();
          expect(calls[0].object).toBe(parentNodeBefore);
          expect(calls[0].args).toEqual(['bar']);
        });
      });

      describe("when node already has child by same name", function () {
        beforeEach(function () {
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
        childNode = Node.create({
          nodeName: 'foo'
        });
        node.addChildNode(childNode);
        spyOn(childNode, 'removeFromParentNode').and.callThrough();
        result = node.removeChildNode('foo');
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        expect(node.removeChildNode.saved.childNodeBefore).toBe(childNode);
      });

      it("should remove node from collection", function () {
        expect(node.childNodes.getValue('foo')).toBeUndefined();
      });

      it("should invoke removeFromParentNode on childNode", function () {
        expect(childNode.removeFromParentNode).toHaveBeenCalled();
      });
    });

    describe("renameChildNode()", function () {
      var childNode;

      beforeEach(function () {
        childNode = Node.create({
          nodeName: 'foo'
        });
        spyOn(childNode, 'setNodeName').and.callThrough();
        node.addChildNode(childNode);
        result = node.renameChildNode('foo', 'bar');
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        expect(node.renameChildNode.saved.childNode).toBe(childNode);
      });

      it("should move child node in collection", function () {
        expect(node.childNodes.data).toEqual({
          bar: childNode
        });
      });

      it("should invoke setNodeName on childNode", function () {
        expect(childNode.setNodeName).toHaveBeenCalledWith('bar');
      });
    });

    describe("addToParentNode()", function () {
      var parentNode;

      beforeEach(function () {
        parentNode = Node.create();
        spyOn(parentNode, 'addChildNode');
        result = node.addToParentNode(parentNode);
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        expect(node.addToParentNode.saved.parentNodeBefore).toBeUndefined();
      });

      it("should set parentNode property", function () {
        expect(node.parentNode).toBe(parentNode);
      });

      it("should invoke addChildNode on parent", function () {
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
        result = node.removeFromParentNode();
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        expect(node.removeFromParentNode.saved.parentNodeBefore)
        .toBe(parentNode);
      });

      it("should reset parentNode property", function () {
        expect(node.parentNode).toBeUndefined();
      });

      it("should invoke addChildNode on parent", function () {
        expect(parentNode.removeChildNode).toHaveBeenCalledWith('foo');
      });
    });

    describe("setNodeName()", function () {
      var parentNode;

      beforeEach(function () {
        parentNode = Node.create();
        node.nodeName = 'foo';
        parentNode.addChildNode(node);
        spyOn(parentNode, 'renameChildNode').and.callThrough();

        result = node.setNodeName('bar');
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should save before state", function () {
        expect(node.setNodeName.saved.nodeNameBefore).toBe('foo');
      });

      it("should update nodeName property", function () {
        expect(node.nodeName).toBe('bar');
      });

      it("should invoke renameChildNode on parentNode", function () {
        expect(parentNode.renameChildNode).toHaveBeenCalledWith('foo', 'bar');
      });
    });

    describe("getNodePath()", function () {
      var node2, node3;

      beforeEach(function () {
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
