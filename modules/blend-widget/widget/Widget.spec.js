"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("Widget", function () {
    var Widget,
        widget;

    beforeAll(function () {
      Widget = $oop.getClass('test.$widget.Widget.Widget')
      .blend($widget.Widget);
    });

    describe("create()", function () {
      it("should initialize elementId", function () {
        widget = Widget.create();
        expect(widget.elementId).toBe('w' + widget.instanceId);
      });

      it("should initialize nodeName", function () {
        widget = Widget.create();
        expect(widget.nodeName).toBe(String(widget.instanceId));
      });

      it("should initialize subscriberId", function () {
        widget = Widget.create();
        expect(widget.subscriberId).toBe(String(widget.instanceId));
      });

      it("should initialize elementName", function () {
        widget = Widget.create();
        expect(widget.elementName).toBe('div');
      });
    });

    describe("addChildNode()", function () {
      var childWidget1,
          childWidget2;

      beforeEach(function () {
        widget = Widget.fromNodeName('foo');
        childWidget1 = Widget.fromNodeName('bar');
        childWidget2 = Widget.fromNodeName('baz');
        childWidget1.addChildNode(childWidget2);
      });

      it("should return self", function () {
        var result = widget.addChildNode(childWidget1);
        expect(result).toBe(widget);
      });

      describe("when parent is attached", function () {
        beforeEach(function () {
          widget.addToParentNode($widget.RootWidget.create());
        });

        describe("when passing different node", function () {
          beforeEach(function () {
            spyOn(childWidget1, 'onAttach').and.callThrough();
            spyOn(childWidget2, 'onAttach').and.callThrough();
          });

          it("should invoke onAttach on new children", function () {
            widget.addChildNode(childWidget1);
            expect(childWidget1.onAttach).toHaveBeenCalled();
            expect(childWidget2.onAttach).toHaveBeenCalled();
          });
        });

        describe("when passing same node", function () {
          beforeEach(function () {
            widget.addChildNode(childWidget1);
            spyOn(childWidget1, 'onAttach').and.callThrough();
            spyOn(childWidget2, 'onAttach').and.callThrough();
          });

          it("should not invoke onAttach on new children", function () {
            widget.addChildNode(childWidget1);
            expect(childWidget1.onAttach).not.toHaveBeenCalled();
            expect(childWidget2.onAttach).not.toHaveBeenCalled();
          });
        });
      });

      describe("when parent is detached", function () {
        describe("when passing different node", function () {
          beforeEach(function () {
            spyOn(childWidget1, 'onAttach').and.callThrough();
            spyOn(childWidget2, 'onAttach').and.callThrough();
          });

          it("should not invoke onAttach on new children", function () {
            widget.addChildNode(childWidget1);
            expect(childWidget1.onAttach).not.toHaveBeenCalled();
            expect(childWidget2.onAttach).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("removeChildNode()", function () {
      var childWidget1,
          childWidget2;

      beforeEach(function () {
        widget = Widget.fromNodeName('foo');
        childWidget1 = Widget.fromNodeName('bar');
        childWidget2 = Widget.fromNodeName('baz');
        childWidget1.addChildNode(childWidget2);
      });

      it("should return self", function () {
        var result = widget.removeChildNode(childWidget1);
        expect(result).toBe(widget);
      });

      describe("when parent is attached", function () {
        beforeEach(function () {
          widget.addToParentNode($widget.RootWidget.create());
        });

        describe("when passing existing child node", function () {
          beforeEach(function () {
            widget.addChildNode(childWidget1);
            spyOn(childWidget1, 'onDetach').and.callThrough();
            spyOn(childWidget2, 'onDetach').and.callThrough();
          });

          it("should invoke onDetach", function () {
            widget.removeChildNode('bar');
            expect(childWidget1.onDetach).toHaveBeenCalled();
            expect(childWidget2.onDetach).toHaveBeenCalled();
          });
        });

        describe("when passing absent child node", function () {
          it("should not invoke onDetach", function () {
            beforeEach(function () {
              spyOn(childWidget1, 'onDetach').and.callThrough();
              spyOn(childWidget2, 'onDetach').and.callThrough();
            });

            it("should not invoke onDetach", function () {
              widget.removeChildNode('bar');
              expect(childWidget1.onDetach).not.toHaveBeenCalled();
              expect(childWidget2.onDetach).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe("when parent is detached", function () {
        describe("when passing existing child node", function () {
          beforeEach(function () {
            widget.addChildNode(childWidget1);
            spyOn(childWidget1, 'onDetach').and.callThrough();
            spyOn(childWidget2, 'onDetach').and.callThrough();
          });

          it("should not invoke onDetach", function () {
            widget.removeChildNode('bar');
            expect(childWidget1.onDetach).not.toHaveBeenCalled();
            expect(childWidget2.onDetach).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("isAttached()", function () {
      beforeEach(function () {
        widget = Widget.create();
      });

      describe("when node descends from RootWidget", function () {
        beforeEach(function () {
          widget
          .addToParentNode(
              Widget.create()
              .addToParentNode(
                  $widget.RootWidget.create()));
        });

        it("should return truthy", function () {
          expect(widget.isAttached()).toBeTruthy();
        });
      });

      describe("when node does not descend from RootWidget", function () {
        it("should return falsy", function () {
          expect(widget.isAttached()).toBeFalsy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toWidget()", function () {
    var instances,
        lastInstanceId;

    beforeEach(function () {
      lastInstanceId = $utils.Identifiable.lastInstanceId;
      instances = $utils.Retrievable.instances;
      $utils.Retrievable.instances = {};
      $utils.Identifiable.lastInstanceId = -1;

      $widget.Widget.create();
    });

    afterEach(function () {
      $utils.Retrievable.instances = instances;
      $utils.Identifiable.lastInstanceId = lastInstanceId;
    });

    it("should return matching widget from registry", function () {
      expect('w0'.toWidget()).toBe($utils.Retrievable.instances[0]);
      expect('w1'.toWidget()).toBeUndefined();
    });
  });
});
