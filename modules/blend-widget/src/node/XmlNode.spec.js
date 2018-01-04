"use strict";

var $oop = window['blend-oop'],
    $template = window['blend-template'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("XmlNode", function () {
    var XmlNode,
        xmlNode;

    beforeAll(function () {
      XmlNode = $oop.createClass('test.$widget.XmlNode.XmlNode')
      .blend($widget.Node)
      .blend($widget.XmlNode)
      .define({
        xmlTemplate: [
          //@formatter:off
          '<ul>',
            '<li blend-nodeName="foo"></li>',
            '<li blend-nodeName="bar"></li>',
          '</ul>'
          //@formatter:on
        ].join('')
      })
      .build();
      XmlNode.__builder.forwards = {list: [], lookup: {}};
    });

    it("should initialize _childProperties", function () {
      expect(XmlNode._childProperties)
      .toEqual({
        foo: {
          elementName: 'li',
          nodeOrder: 0
        },
        bar: {
          elementName: 'li',
          nodeOrder: 1
        }
      });
    });

    it("should initialize _template", function () {
      expect(XmlNode._template)
      .toEqual('<ul>{{foo}}{{bar}}</ul>'.toTemplate());
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

      it("should pass additional properties to create", function () {
        xmlNode = XmlNode.fromElementName('Tag', {bar: 'baz'});
        expect(xmlNode.bar).toBe('baz');
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

    describe("getChildProperties()", function () {
      beforeEach(function () {
        xmlNode = XmlNode.fromElementName('Tag');
      });

      describe("for expected child", function () {
        it("should return properties", function () {
          var result = xmlNode.getChildProperties('foo');
          expect(result).toEqual({
            elementName: 'li',
            nodeOrder: 0
          });
        });
      });

      describe("for unexpected child", function () {
        it("should return undefined", function () {
          var result = xmlNode.getChildProperties('baz');
          expect(result).toBeUndefined();
        });
      });
    });

    describe("createChildNode()", function () {
      beforeEach(function () {
        xmlNode = XmlNode.fromElementName('Tag');
      });

      it("should return self", function () {
        var result = xmlNode.createChildNode(XmlNode, {elementName: 'abc'});
        expect(result).toBe(xmlNode);
      });

      it("should create & add child node", function () {
        xmlNode.createChildNode(XmlNode, {nodeName: 'foo'});
        var firstChild = xmlNode.childNodes.data[0];
        expect(firstChild.nodeName).toBe('foo');
        expect(firstChild.elementName).toBe('li');
      });

      describe("on conflicting between template & properties", function () {
        beforeEach(function () {
          xmlNode.createChildNode(XmlNode, {
            nodeName: 'foo',
            elementName: 'span'
          });
        });

        it("should give properties precedence", function () {
          var firstChild = xmlNode.childNodes.data[0];
          expect(firstChild.elementName).toBe('span');
        });
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

    describe("getContentMarkup()", function () {
      beforeEach(function () {
        xmlNode = XmlNode.fromElementName('Foo');
        xmlNode.createChildNode(XmlNode, {
          nodeName: 'foo',
          attributes: $widget.XmlAttributes.fromData({bar: 'baz'})
        });
      });

      it("should return markup for children", function () {
        expect(xmlNode.getContentMarkup())
        .toBe('<ul><li bar="baz"><ul></ul></li></ul>');
      });
    });

    describe("toString()", function () {
      it("should return generated markup", function () {
        xmlNode = XmlNode.fromElementName('Tag')
        .setAttribute('foo', 'bar');
        expect(xmlNode + '').toBe('<Tag foo="bar"><ul></ul></Tag>');
      });

      describe("when element name contains XML entities", function () {
        it("should escape XML entities", function () {
          xmlNode = XmlNode.fromElementName('"Tag"')
          .setAttribute('foo', 'bar');
          expect(xmlNode + '')
          .toBe('<&quot;Tag&quot; foo="bar"><ul></ul></&quot;Tag&quot;>');
        });
      });

      describe("when node has children", function () {
        beforeEach(function () {
          xmlNode = XmlNode.fromElementName('Tag')
          .setAttribute('foo', 'bar')
          .createChildNode(XmlNode, {
            nodeName: 'foo',
            attributes: $widget.XmlAttributes.fromData({baz: 'BAZ'})
          })
          .createChildNode(XmlNode, {
            nodeName: 'bar',
            attributes: $widget.XmlAttributes.fromData({quux: 'QUUX'})
          });
        });

        it("should include contents", function () {
          expect(xmlNode + '')
          .toBe([
            //@formatter:off
            '<Tag foo="bar">',
              '<ul>',
                '<li baz="BAZ"><ul></ul></li>',
                '<li quux="QUUX"><ul></ul></li>',
              '</ul>',
            '</Tag>'
            //@formatter:on
          ].join(''));
        });
      });
    });
  });
});
