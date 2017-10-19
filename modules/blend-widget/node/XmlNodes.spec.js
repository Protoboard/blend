"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("XmlNodes", function () {
    var XmlNode,
        XmlNodes,
        xmlNodes;

    beforeAll(function () {
      XmlNode = $oop.getClass('test.$widget.XmlNodes.XmlNode')
      .blend($widget.Node)
      .blend($widget.XmlNode);
      XmlNodes = $oop.getClass('test.$widget.XmlNodes.XmlNodes')
      .blend($widget.XmlNodes);
    });

    describe("toString()", function () {
      it("should serialize all nodes in predictable", function () {
        xmlNodes = XmlNodes.fromData({
          0: XmlNode.fromElementName('Tag1')
          .setNodeOrder(2),
          1: XmlNode.fromElementName('Tag2')
          .setNodeOrder(1),
          2: XmlNode.fromElementName('Tag3')
          .setNodeOrder(2)
        });
        expect(xmlNodes + '').toBe([
          '<Tag2></Tag2>',
          '<Tag1></Tag1>',
          '<Tag3></Tag3>'
        ].join(''));
      });
    });
  });
});
