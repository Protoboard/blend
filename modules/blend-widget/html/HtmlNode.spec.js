"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("HtmlNode", function () {
    var HtmlNode,
        htmlNode;

    beforeAll(function () {
      HtmlNode = $oop.getClass('test.$widget.HtmlNode.HtmlNode')
      .blend($widget.Node)
      .blend($widget.HtmlNode);
      HtmlNode.__forwards = {list: [], sources: {}, lookup: {}};
    });

    describe("fromElementId()", function () {
      it("should return HtmlNode instance", function () {
        htmlNode = HtmlNode.fromElementId('foo');
        expect(HtmlNode.mixedBy(htmlNode)).toBeTruthy();
      });

      it("should initialize elementId", function () {
        htmlNode = HtmlNode.fromElementId('foo');
        expect(htmlNode.elementId).toBe('foo');
      });
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        htmlNode = HtmlNode.create();
        expect(htmlNode.elementName).toBe('div');
      });

      it("should initialize inlineStyles", function () {
        htmlNode = HtmlNode.create();
        expect($widget.InlineStyles.mixedBy(htmlNode.inlineStyles))
        .toBeTruthy();
        expect(htmlNode.inlineStyles).toEqual($widget.InlineStyles.create());
      });

      it("should initialize 'id' attribute", function () {
        htmlNode = HtmlNode.create({
          elementId: 'foo'
        });
        expect(htmlNode.attributes.getValue('id')).toBe('foo');
      });

      it("should initialize 'class' attribute", function () {
        htmlNode = HtmlNode.create({
          nodeName: 'baz',
          cssClasses: $widget.CssClasses.fromData({
            foo: 'foo',
            bar: 'bar'
          })
        });
        expect(htmlNode.attributes.getValue('class'))
        .toBe('foo bar');
      });

      it("should initialize 'style' attribute", function () {
        htmlNode = HtmlNode.create({
          inlineStyles: $widget.InlineStyles.fromData({
            width: '10px',
            height: '1em'
          })
        });
        expect(htmlNode.attributes.getValue('style'))
        .toBe('width:10px;height:1em');
      });
    });

    describe("setElementId()", function () {
      var result;

      beforeEach(function () {
        htmlNode = HtmlNode.create();
        result = htmlNode.setElementId('w0');
      });

      it("should return self", function () {
        expect(result).toBe(htmlNode);
      });

      it("should set elementId property", function () {
        expect(htmlNode.elementId).toBe('w0');
      });

      it("should update 'id' attribute", function () {
        expect(htmlNode.attributes.getValue('id')).toBe('w0');
      });
    });

    describe("addCssClass()", function () {
      beforeEach(function () {
        htmlNode = HtmlNode.fromNodeName('foo');
      });

      it("should return self", function () {
        var result = htmlNode.addCssClass('bar');
        expect(result).toBe(htmlNode);
      });

      it("should add to cssClasses", function () {
        htmlNode.addCssClass('bar');
        expect(htmlNode.cssClasses.hasItem('bar', 'bar')).toBeTruthy();
      });

      it("should update 'class' attribute", function () {
        htmlNode.addCssClass('bar');
        expect(htmlNode.getAttribute('class'))
        .toBe('bar');
      });
    });

    describe("hasCssClass()", function () {
      beforeEach(function () {
        htmlNode = HtmlNode.create()
        .addCssClass('foo');
      });

      describe("for present CSS class", function () {
        it("should return truthy", function () {
          expect(htmlNode.hasCssClass('foo')).toBeTruthy();
        });
      });

      describe("for absent CSS class", function () {
        it("should return falsy", function () {
          expect(htmlNode.hasCssClass('bar')).toBeFalsy();
        });
      });
    });

    describe("removeCssClass()", function () {
      beforeEach(function () {
        htmlNode = HtmlNode.create({
          nodeName: 'foo'
        })
        .addCssClass('bar');
      });

      it("should return self", function () {
        var result = htmlNode.removeCssClass('bar');
        expect(result).toBe(htmlNode);
      });

      it("should remove from cssClasses", function () {
        htmlNode.removeCssClass('bar');
        expect(htmlNode.cssClasses.hasItem('bar', 'bar')).toBeFalsy();
      });

      it("should update 'class' attribute", function () {
        htmlNode.removeCssClass('bar');
        expect(htmlNode.getAttribute('class')).toBeUndefined();
      });
    });

    describe("setInlineStyle()", function () {
      beforeEach(function () {
        htmlNode = HtmlNode.create();
      });

      it("should return self", function () {
        var result = htmlNode.setInlineStyle('foo', 'bar');
        expect(result).toBe(htmlNode);
      });

      it("should add to inlineStyles", function () {
        htmlNode.setInlineStyle('foo', 'bar');
        expect(htmlNode.inlineStyles).toEqual($widget.InlineStyles.fromData({
          foo: 'bar'
        }));
      });

      it("should update 'style' attribute", function () {
        htmlNode.setInlineStyle('foo', 'bar');
        expect(htmlNode.getAttribute('style')).toBe('foo:bar');
      });
    });

    describe("getInlineStyle()", function () {
      beforeEach(function () {
        htmlNode = HtmlNode.create()
        .setInlineStyle('foo', 'bar');
      });

      it("should return inline style for specified name", function () {
        expect(htmlNode.getInlineStyle('foo')).toBe('bar');
      });

      describe("for absent inline style", function () {
        it("should return undefined", function () {
          expect(htmlNode.getInlineStyle('bar')).toBeUndefined();
        });
      });
    });

    describe("deleteInlineStyle()", function () {
      beforeEach(function () {
        htmlNode = HtmlNode.create()
        .setInlineStyle('foo', 'bar');
      });

      it("should return self", function () {
        var result = htmlNode.deleteInlineStyle('foo');
        expect(result).toBe(htmlNode);
      });

      it("should remove from inlineStyles", function () {
        htmlNode.deleteInlineStyle('foo');
        expect(htmlNode.inlineStyles)
        .toEqual($widget.InlineStyles.fromData({}));
      });

      it("should update 'style' attribute", function () {
        htmlNode.deleteInlineStyle('foo');
        expect(htmlNode.getAttribute('style')).toBeUndefined();
      });
    });
  });
});
