"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $widget = window['cake-widget'];

describe("$widget", function () {
  describe("Node", function () {
    var Node,
        node,
        result;

    beforeEach(function () {
      Node = $oop.getClass('test.$widget.Node.Node')
      .mix($widget.Node);
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
        result = node.addChildNode(childNode);
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should add node to childNodes", function () {
        expect(node.childNodes.getValue('foo')).toBe(childNode);
      });

      it("should set parentNode on child", function () {
        expect(childNode.parentNode).toBe(node);
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

        result = node.removeChildNode('foo');
      });

      it("should return self", function () {
        expect(result).toBe(node);
      });

      it("should remove node from collection", function () {
        expect(node.childNodes.getValue('foo')).toBeUndefined();
      });

      it("should reset parentNode on child", function () {
        expect(childNode.parentNode).toBeUndefined();
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

      it("should update nodeName property", function () {
        expect(node.nodeName).toBe('bar');
      });

      it("should invoke renameChildNode on parentNode", function () {
        expect(parentNode.renameChildNode).toHaveBeenCalledWith('foo', 'bar');
      });
    });
  });
});
