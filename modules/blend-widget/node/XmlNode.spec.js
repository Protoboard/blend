"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("XmlNode", function () {
    var XmlNode,
        xmlNode;

    beforeAll(function () {
      XmlNode = $oop.getClass('test.$widget.XmlNode.XmlNode')
      .blend($widget.Node)
      .blend($widget.XmlNode);
    });

    describe("fromElementName()", function () {
      it("should return XmlNode instance", function () {
        xmlNode = XmlNode.fromElementName('Tag');
        expect(XmlNode.mixedBy(xmlNode)).toBeTruthy();
      });

      it("should initialize elementName", function () {
        xmlNode = XmlNode.fromElementName('Tag');
        expect(xmlNode.elementName).toBe('Tag');
      });
    });

    describe("create()", function () {
      describe("when no elementName is specified", function () {
        it("should throw", function () {
          expect(function () {
            XmlNode.create();
          }).toThrow();
        });
      });

      it("should re-initialize childNodes", function () {
        xmlNode = XmlNode.create({elementName: 'Tag'});
        expect($widget.XmlNodes.mixedBy(xmlNode.childNodes)).toBeTruthy();
      });

      it("should initialize attributes", function () {
        xmlNode = XmlNode.create({elementName: 'Tag'});
        expect($widget.XmlAttributes.mixedBy(xmlNode.attributes))
        .toBeTruthy();
        expect(xmlNode.attributes).toEqual($widget.XmlAttributes.create());
      });
    });

    describe("setAttribute()", function () {
      beforeEach(function () {
        xmlNode = XmlNode.fromElementName('Tag');
      });

      it("should return self", function () {
        var result = xmlNode.setAttribute('foo', 'bar');
        expect(result).toBe(xmlNode);
      });

      it("should add to attributes", function () {
        xmlNode.setAttribute('foo', 'bar');
        expect(xmlNode.attributes.data).toEqual({
          foo: 'bar'
        });
      });
    });

    describe("getAttribute()", function () {
      beforeEach(function () {
        xmlNode = XmlNode.fromElementName('Tag')
        .setAttribute('foo', 'bar');
      });

      it("should return specified XML attribute", function () {
        var result = xmlNode.getAttribute('foo');
        expect(result).toBe('bar');
      });

      describe("for absent attributeName", function () {
        it("should return undefined", function () {
          var result = xmlNode.getAttribute('baz');
          expect(result).toBeUndefined();
        });
      });
    });

    describe("deleteAttribute()", function () {
      beforeEach(function () {
        xmlNode = XmlNode.fromElementName('Tag')
        .setAttribute('foo', 'bar');
      });

      it("should return self", function () {
        var result = xmlNode.deleteAttribute('foo');
        expect(result).toBe(xmlNode);
      });

      it("should remove from attributes", function () {
        xmlNode.deleteAttribute('foo');
        expect(xmlNode.attributes.data).toEqual({});
      });
    });

    describe("toString()", function () {
      it("should return generated markup", function () {
        xmlNode = XmlNode.fromElementName('Tag')
        .setAttribute('foo', 'bar');
        expect(xmlNode + '').toBe('<Tag foo="bar"></Tag>');
      });

      describe("when element name contains XML entities", function () {
        it("should escape XML entities", function () {
          xmlNode = XmlNode.fromElementName('"Tag"')
          .setAttribute('foo', 'bar');
          expect(xmlNode + '')
          .toBe('<&quotTag&quot foo="bar"></&quotTag&quot>');
        });
      });

      describe("when node has children", function () {
        beforeEach(function () {
          xmlNode = XmlNode.fromElementName('Tag')
          .setAttribute('foo', 'bar')
          .addChildNode(
              XmlNode.fromElementName('Tag')
              .setAttribute('baz', 'BAZ'))
          .addChildNode(
              XmlNode.fromElementName('Tag')
              .setAttribute('quux', 'QUUX'));
        });

        it("should include contents", function () {
          expect(xmlNode + '')
          .toBe([
            '<Tag foo="bar">',
            '<Tag baz="BAZ"></Tag>',
            '<Tag quux="QUUX"></Tag>',
            '</Tag>'
          ].join(''));
        });
      });
    });
  });
});
