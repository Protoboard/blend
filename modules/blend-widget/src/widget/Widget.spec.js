"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("Widget", function () {
    var Widget,
        widget,
        RootWidget;

    beforeAll(function () {
      Widget = $oop.createClass('test.$widget.Widget.Widget')
      .blend($widget.Widget)
      .build();
      Widget.__builder.forwards = {list: [], lookup: {}};
      RootWidget = $oop.createClass('test.$widget.Widget.RootWidget')
      .blend($widget.RootWidget)
      .build();
      RootWidget.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize nodeName", function () {
        widget = Widget.create();
        expect(widget.nodeName).toBe(String(widget.instanceId));
      });

      it("should initialize subscriberId", function () {
        widget = Widget.create();
        expect(widget.subscriberId).toBe(String(widget.instanceId));
      });
    });

    describe("#addChildNode()", function () {
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
          widget.addToParentNode(RootWidget.create());
        });

        afterEach(function () {
          widget.removeFromParentNode();
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

    describe("#removeChildNode()", function () {
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
          widget.addToParentNode(RootWidget.create());
        });

        afterEach(function () {
          widget.removeFromParentNode();
        });

        describe("when passing existing child name", function () {
          beforeEach(function () {
            widget.addChildNode(childWidget1);
            spyOn(childWidget1, 'off');
            spyOn(childWidget2, 'off');
            spyOn(childWidget1, 'onDetach').and.callThrough();
            spyOn(childWidget2, 'onDetach').and.callThrough();
          });

          it("should invoke onDetach", function () {
            widget.removeChildNode('bar');
            expect(childWidget1.onDetach).toHaveBeenCalled();
            expect(childWidget2.onDetach).toHaveBeenCalled();
          });

          it("should have children unsubscribe from events", function () {
            widget.removeChildNode('bar');
            expect(childWidget1.off).toHaveBeenCalled();
            expect(childWidget2.off).toHaveBeenCalled();
          });
        });

        describe("when passing absent child name", function () {
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

    describe("#addToParentNode()", function () {
      var childWidget1,
          childWidget2,
          listeningPath,
          listeningPath1,
          listeningPath2;

      beforeEach(function () {
        widget = Widget.fromNodeName('foo');
        childWidget1 = Widget.fromNodeName('bar');
        childWidget2 = Widget.fromNodeName('baz');
        childWidget1.addChildNode(childWidget2);
        listeningPath = ['widget', widget.instanceId].join('.');
        listeningPath1 = ['widget', widget.instanceId,
          childWidget1.instanceId].join('.');
        listeningPath2 = ['widget', widget.instanceId,
          childWidget1.instanceId, childWidget2.instanceId].join('.');
      });

      it("should return self", function () {
        var result = childWidget1.addToParentNode(widget);
        expect(result).toBe(childWidget1);
      });

      describe("when passing different parent node", function () {
        describe("when new parent is attached", function () {
          beforeEach(function () {
            spyOn(widget, 'isAttached').and.returnValue(true);
          });

          it("should set event paths on children", function () {
            childWidget1.addToParentNode(widget);
            expect(childWidget1.listeningPath).toBe(listeningPath1);
            expect(childWidget1.triggerPaths.list)
            .toContain(listeningPath1, listeningPath, 'widget');
            expect(childWidget2.listeningPath).toBe(listeningPath2);
            expect(childWidget2.triggerPaths.list)
            .toContain(listeningPath2, listeningPath1, 'widget');
          });
        });

        describe("when new parent is not attached", function () {
          it("should not set event paths on children", function () {
            childWidget1.addToParentNode(widget);
            expect(childWidget1.listeningPath).not.toBe(listeningPath1);
            expect(childWidget1.triggerPaths.list)
            .not.toContain(listeningPath1, listeningPath, 'widget');
            expect(childWidget2.listeningPath).not.toBe(listeningPath2);
            expect(childWidget2.triggerPaths.list)
            .not.toContain(listeningPath2, listeningPath1, 'widget');
          });
        });

        describe("when node was already added to parent", function () {
          var widget2,
              isAttached;

          beforeEach(function () {
            widget2 = Widget.fromNodeName('quux');
            isAttached = spyOn(widget, 'isAttached').and.returnValue(true);
            childWidget1.addToParentNode(widget);
          });

          describe("when previous parent is attached", function () {
            it("should remove old event paths", function () {
              childWidget1.addToParentNode(widget2);
              expect(childWidget1.listeningPath).not.toBe(listeningPath1);
              expect(childWidget1.triggerPaths.list)
              .not.toContain(listeningPath1, listeningPath, 'widget');
              expect(childWidget2.listeningPath).not.toBe(listeningPath2);
              expect(childWidget2.triggerPaths.list)
              .not.toContain(listeningPath2, listeningPath1, 'widget');
            });
          });

          describe("when previous parent is not attached", function () {
            beforeEach(function () {
              isAttached.and.returnValue(false);
            });

            it("should not remove old event paths", function () {
              var listeningPath = ['widget', widget.instanceId].join('.'),
                  listeningPath1 = ['widget', widget.instanceId,
                    childWidget1.instanceId].join('.'),
                  listeningPath2 = ['widget', widget.instanceId,
                    childWidget1.instanceId, childWidget2.instanceId].join('.');

              childWidget1.addToParentNode(widget2);
              expect(childWidget1.listeningPath).toBe(listeningPath1);
              expect(childWidget1.triggerPaths.list)
              .toContain(listeningPath1, listeningPath, 'widget');
              expect(childWidget2.listeningPath).toBe(listeningPath2);
              expect(childWidget2.triggerPaths.list)
              .toContain(listeningPath2, listeningPath1, 'widget');
            });
          });
        });
      });
    });

    describe("#removeFromParentNode()", function () {
      var childWidget1,
          childWidget2,
          isAttached,
          listeningPath,
          listeningPath1,
          listeningPath2;

      beforeEach(function () {
        widget = Widget.fromNodeName('foo');
        childWidget1 = Widget.fromNodeName('bar');
        childWidget2 = Widget.fromNodeName('baz');
        isAttached = spyOn(widget, 'isAttached').and.returnValue(true);
        widget.addChildNode(
            childWidget1.addChildNode(
                childWidget2));
        listeningPath = ['widget', widget.instanceId].join('.');
        listeningPath1 = ['widget', widget.instanceId,
          childWidget1.instanceId].join('.');
        listeningPath2 = ['widget', widget.instanceId,
          childWidget1.instanceId, childWidget2.instanceId].join('.');
      });

      it("should return self", function () {
        var result = childWidget1.removeFromParentNode();
        expect(result).toBe(childWidget1);
      });

      describe("when node was already added to parent", function () {
        it("should remove old event paths", function () {
          childWidget1.removeFromParentNode();
          expect(childWidget1.listeningPath).toBeUndefined();
          expect(childWidget1.triggerPaths.list)
          .not.toContain(listeningPath1, listeningPath, 'widget');
          expect(childWidget2.listeningPath).toBeUndefined();
          expect(childWidget2.triggerPaths.list)
          .not.toContain(listeningPath2, listeningPath1, 'widget');
        });

        describe("when previous parent is not attached", function () {
          beforeEach(function () {
            isAttached.and.returnValue(false);
          });

          it("should not remove old event paths", function () {
            var listeningPath = ['widget', widget.instanceId].join('.'),
                listeningPath1 = ['widget', widget.instanceId,
                  childWidget1.instanceId].join('.'),
                listeningPath2 = ['widget', widget.instanceId,
                  childWidget1.instanceId, childWidget2.instanceId].join('.');

            childWidget1.addToParentNode(widget);
            expect(childWidget1.listeningPath).toBe(listeningPath1);
            expect(childWidget1.triggerPaths.list)
            .toContain(listeningPath1, listeningPath, 'widget');
            expect(childWidget2.listeningPath).toBe(listeningPath2);
            expect(childWidget2.triggerPaths.list)
            .toContain(listeningPath2, listeningPath1, 'widget');
          });
        });
      });
    });

    describe("#setStateValue()", function () {
      beforeEach(function () {
        widget = Widget.create({
          state: {
            foo: 'bar'
          }
        });
        spyOn($widget.StateChangeEvent, 'trigger');
      });

      it("should return self", function () {
        var result = widget.setStateValue('foo', 'baz');
        expect(result).toBe(widget);
      });

      it("should trigger EVENT_STATE_CHANGE", function () {
        widget.setStateValue('foo', 'baz');
        var calls = $widget.StateChangeEvent.trigger.calls.all(),
            event = calls[0].object;
        expect(event.stateName).toBe('foo');
        expect(event.stateValueBefore).toBe('bar');
        expect(event.stateValueAfter).toBe('baz');
      });
    });

    describe("#isAttached()", function () {
      beforeEach(function () {
        widget = Widget.create();
      });

      describe("when node descends from RootWidget", function () {
        beforeEach(function () {
          widget
          .addToParentNode(
              Widget.create()
              .addToParentNode(
                  RootWidget.create()));
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
  describe("#toWidget()", function () {
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
