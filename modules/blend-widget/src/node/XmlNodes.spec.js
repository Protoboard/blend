"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("XmlNodes", function () {
    var XmlNode,
        XmlNodes,
        xmlNodes;

    beforeAll(function () {
      XmlNode = $oop.createClass('test.$widget.XmlNodes.XmlNode')
      .blend($widget.Node)
      .blend($widget.XmlNode)
      .build();
      XmlNodes = $oop.createClass('test.$widget.XmlNodes.XmlNodes')
      .blend($widget.XmlNodes)
      .build();
    });

    describe("#toString()", function () {
      it("should serialize all nodes in order", function () {
        xmlNodes = XmlNodes.create()
        .setItem(
            XmlNode.fromElementName('Tag1')
            .setNodeOrder(2))
        .setItem(
            XmlNode.fromElementName('Tag2')
            .setNodeOrder(1))
        .setItem(
            XmlNode.fromElementName('Tag3')
            .setNodeOrder(2));

        expect(xmlNodes + '').toBe([
          '<Tag2></Tag2>',
          '<Tag1></Tag1>',
          '<Tag3></Tag3>'
        ].join(''));
      });
    });
  });
});
