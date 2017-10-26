"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("DomWidget", function () {
    var DomWidget,
        domWidget;

    beforeAll(function () {
      DomWidget = $oop.getClass('test.$widget.DomWidget.DomWidget')
      .blend($widget.Widget)
      .blend($widget.HtmlWidget)
      .blend($widget.DomWidget);
      DomWidget.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("addChildNode()", function () {
      var element,
          childWidget1,
          childWidget2;

      beforeEach(function () {
        domWidget = DomWidget.fromNodeName('foo');
        element = document.createElement('div');
        childWidget1 = DomWidget.fromNodeName('bar');
        childWidget2 = DomWidget.fromNodeName('baz');
        childWidget1.addChildNode(childWidget2);
      });

      it("should return self", function () {
        var result = domWidget.addChildNode(childWidget1);
        expect(result).toBe(domWidget);
      });

      describe("when parent is attached", function () {
        beforeEach(function () {
          domWidget.addToParentNode($widget.RootWidget.create());
        });

        afterEach(function () {
          domWidget.removeFromParentNode();
        });

        describe("when parent is rendered", function () {
          beforeEach(function () {
            spyOn(domWidget, 'getElement').and.returnValue(element);
          });

          describe("when passing different node", function () {
            beforeEach(function () {
              spyOn(childWidget1, 'onRender').and.callThrough();
              spyOn(childWidget2, 'onRender').and.callThrough();
            });

            it("should invoke onRender on new children", function () {
              domWidget.addChildNode(childWidget1);
              expect(childWidget1.onRender).toHaveBeenCalled();
              expect(childWidget2.onRender).toHaveBeenCalled();
            });
          });

          describe("when passing same node", function () {
            beforeEach(function () {
              domWidget.addChildNode(childWidget1);
              spyOn(childWidget1, 'onRender').and.callThrough();
              spyOn(childWidget2, 'onRender').and.callThrough();
            });

            it("should not invoke onRender on new children", function () {
              domWidget.addChildNode(childWidget1);
              expect(childWidget1.onRender).not.toHaveBeenCalled();
              expect(childWidget2.onRender).not.toHaveBeenCalled();
            });
          });
        });

        describe("when parent is not rendered", function () {
          beforeEach(function () {
            spyOn(domWidget, 'getElement');
            spyOn(childWidget1, 'onRender').and.callThrough();
            spyOn(childWidget2, 'onRender').and.callThrough();
          });

          it("should not invoke onRender on new children", function () {
            domWidget.addChildNode(childWidget1);
            expect(childWidget1.onRender).not.toHaveBeenCalled();
            expect(childWidget2.onRender).not.toHaveBeenCalled();
          });
        });
      });

      describe("when parent is detached", function () {
        describe("when passing different node", function () {
          beforeEach(function () {
            spyOn(childWidget1, 'onRender').and.callThrough();
            spyOn(childWidget2, 'onRender').and.callThrough();
          });

          it("should not invoke onRender on new children", function () {
            domWidget.addChildNode(childWidget1);
            expect(childWidget1.onRender).not.toHaveBeenCalled();
            expect(childWidget2.onRender).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
