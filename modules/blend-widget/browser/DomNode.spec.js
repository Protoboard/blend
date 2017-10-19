"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("DomNode", function () {
    var DomNode,
        domNode;

    beforeAll(function () {
      DomNode = $oop.getClass('test.$widget.DomNode.DomNode')
      .blend($widget.Node)
      .blend($widget.HtmlNode)
      .blend($widget.DomNode);
    });

    describe("setAttribute()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.create();
        spyOn(domNode, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.setAttribute('foo', 'bar');
        expect(result).toBe(domNode);
      });

      it("should set attribute on element", function () {
        domNode.setAttribute('foo', 'bar');
        expect(element.getAttribute('foo')).toBe('bar');
      });

      describe("when attribute is style", function () {
        it("should set style.cssText", function () {
          domNode.setAttribute('style', 'width:10px');
          expect(element.style.cssText).toBe('width: 10px;');
        });
      });
    });

    describe("deleteAttribute()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.create();
        spyOn(domNode, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.deleteAttribute('foo');
        expect(result).toBe(domNode);
      });

      it("should remove attribute from element", function () {
        domNode.setAttribute('foo', 'bar');
        domNode.deleteAttribute('foo');
        expect(element.getAttribute('foo')).toBe(null);
      });

      describe("when attribute is style", function () {
        beforeEach(function () {
          domNode.setAttribute('style', 'width:10px');
        });

        it("should set style.cssText", function () {
          domNode.deleteAttribute('style');
          expect(element.style.cssText).toBe('');
        });
      });
    });

    describe("createElement()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo')
        .setAttribute('hello', 'world')
        .addChildNode(DomNode.fromElementId('bar'));
        spyOn(document, 'createElement').and.returnValue(element);
      });

      it("should create new HTML element", function () {
        domNode.createElement();
        expect(document.createElement)
        .toHaveBeenCalledWith(domNode.elementName);
      });

      it("should return Element instance", function () {
        var result = domNode.createElement();
        expect(result).toBe(element);
      });

      it("should add attributes", function () {
        var result = domNode.createElement();
        expect(result.getAttribute('hello')).toBe('world');
      });

      it("should add contents", function () {
        var result = domNode.createElement();
        expect(result.innerHTML).toEqual('<div id="bar"></div>');
      });
    });

    describe("getElement()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo');
        spyOn(document, 'getElementById').and.returnValue(element);
      });

      it("should retrieve element by elementId", function () {
        domNode.getElement();
        expect(document.getElementById).toHaveBeenCalledWith('foo');
      });

      it("should return retrieved element", function () {
        var result = domNode.getElement();
        expect(result).toBe(element);
      });
    });

    describe("renderAtEnd()", function () {
      var parentElement,
          element;

      beforeEach(function () {
        parentElement = document.createElement('div');
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo');

        spyOn(domNode, 'createElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.renderAtEnd(parentElement);
        expect(result).toBe(domNode);
      });

      it("should append element to parentElement", function () {
        domNode.renderAtEnd(parentElement);
        expect(parentElement.lastChild).toBe(element);
      });

      describe("when already rendered in DOM", function () {
        var oldParentElement;

        beforeEach(function () {
          oldParentElement = document.createElement('div');
          oldParentElement.appendChild(element);
          spyOn(domNode, 'getElement').and.returnValue(element);
        });

        it("should remove element from old parent", function () {
          domNode.renderAtEnd(parentElement);
          expect(oldParentElement.contains(element)).toBeFalsy();
        });
      });
    });

    describe("renderAtStart()", function () {
      var parentElement;
      var element;

      beforeEach(function () {
        parentElement = document.createElement('div');
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo');
        spyOn(domNode, 'createElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.renderAtStart(parentElement);
        expect(result).toBe(domNode);
      });

      it("should append element to parentNode", function () {
        domNode.renderAtStart(parentElement);
        expect(parentElement.firstChild).toBe(element);
      });

      describe("when already rendered in DOM", function () {
        var oldParentElement;

        beforeEach(function () {
          oldParentElement = document.createElement('div');
          oldParentElement.appendChild(element);
          spyOn(domNode, 'getElement').and.returnValue(element);
        });

        it("should remove element from old parent", function () {
          domNode.renderAtStart(parentElement);
          expect(oldParentElement.contains(element)).toBeFalsy();
        });
      });

      describe("when parent has children", function () {
        var element1;

        beforeEach(function () {
          element1 = document.createElement('div');
          parentElement.appendChild(element1);
        });

        it("should insert before first child", function () {
          domNode.renderAtStart(parentElement);
          expect(parentElement.firstChild).toBe(element);
          expect(parentElement.lastChild).toBe(element1);
        });
      });
    });

    describe("renderBefore()", function () {
      var parentElement,
          nextElement,
          element;

      beforeEach(function () {
        parentElement = document.createElement('div');
        nextElement = document.createElement('div');
        element = document.createElement('div');
        parentElement.appendChild(document.createElement('div'));
        parentElement.appendChild(nextElement);

        domNode = DomNode.fromElementId('foo');

        spyOn(domNode, 'createElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.renderBefore(nextElement);
        expect(result).toBe(domNode);
      });

      it("should insert element before nextElement", function () {
        domNode.renderBefore(nextElement);
        expect(element.nextSibling).toBe(nextElement);
      });

      describe("when already rendered in DOM", function () {
        var oldParentElement;

        beforeEach(function () {
          oldParentElement = document.createElement('div');
          oldParentElement.appendChild(element);

          spyOn(domNode, 'getElement').and.returnValue(element);
        });

        it("should remove element from old parent", function () {
          domNode.renderBefore(nextElement);
          expect(oldParentElement.contains(element)).toBeFalsy();
        });
      });
    });

    describe("renderAfter()", function () {
      var parentElement,
          previousElement,
          element;

      beforeEach(function () {
        parentElement = document.createElement('div');
        previousElement = document.createElement('div');
        element = document.createElement('div');
        parentElement.appendChild(previousElement);

        domNode = DomNode.fromElementId('foo');

        spyOn(domNode, 'createElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.renderAfter(previousElement);
        expect(result).toBe(domNode);
      });

      it("should insert element after previousElement", function () {
        domNode.renderAfter(previousElement);
        expect(element.previousSibling).toBe(previousElement);
      });

      describe("when already rendered in DOM", function () {
        var oldParentElement;

        beforeEach(function () {
          oldParentElement = document.createElement('div');
          oldParentElement.appendChild(element);

          spyOn(domNode, 'getElement').and.returnValue(element);
        });

        it("should remove element from old parent", function () {
          domNode.renderAfter(previousElement);
          expect(oldParentElement.contains(element)).toBeFalsy();
        });
      });

      describe("when previousElement is not last sibling", function () {
        var element1;

        beforeEach(function () {
          element1 = document.createElement('div');
          parentElement.appendChild(element1);
        });

        it("should insert after previous", function () {
          domNode.renderAfter(previousElement);
          expect(previousElement.nextSibling).toBe(element);
          expect(element.nextSibling).toBe(element1);
        });
      });
    });

    describe("reRender()", function () {
      var parentElement,
          oldElement,
          newElement;

      beforeEach(function () {
        parentElement = document.createElement('div');
        oldElement = document.createElement('div');
        newElement = document.createElement('div');
        parentElement.appendChild(oldElement);
        domNode = DomNode.fromElementId('foo');

        spyOn(domNode, 'getElement').and.returnValue(oldElement);
        spyOn(domNode, 'createElement').and.returnValue(newElement);
      });

      it("should return self", function () {
        var result = domNode.reRender();
        expect(result).toBe(domNode);
      });

      it("should replace element", function () {
        domNode.reRender();
        expect(parentElement.contains(oldElement)).toBeFalsy();
        expect(parentElement.contains(newElement)).toBeTruthy();
      });
    });
  });
});
