"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("BinaryStateful", function () {
    var BinaryStateful,
        binaryStateful;

    beforeAll(function () {
      BinaryStateful = $oop.getClass('test.$widgets.BinaryStateful.BinaryStateful')
      .blend($widget.Widget)
      .blend($widgets.BinaryStateful);
      BinaryStateful.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize binaryStates", function () {
        binaryStateful = BinaryStateful.create();
        expect($data.Collection.mixedBy(binaryStateful.binaryStates))
        .toBeTruthy();
      });
    });

    describe("onAttach()", function () {
      var binaryStateful1,
          parentWidget;

      beforeEach(function () {
        binaryStateful = BinaryStateful.create();
        binaryStateful1 = BinaryStateful.create();
        parentWidget = $widget.Widget.create();

        binaryStateful1.addBinaryState('foo');
        binaryStateful1.addBinaryStateSourceId('foo', 'bar');
        binaryStateful.addBinaryState('foo', true);

        binaryStateful1
        .addChildNode(
            parentWidget
            .addChildNode(binaryStateful));
      });

      it("should impose parents' cascading state", function () {
        binaryStateful.onAttach();
        expect(binaryStateful.isStateOn('foo')).toBeTruthy();
      });
    });

    describe("onDetach()", function () {
      beforeEach(function () {
        binaryStateful = BinaryStateful.create();
        binaryStateful.addBinaryState('foo');
        binaryStateful.addBinaryStateSourceId('foo', 'imposed');

        binaryStateful.onAttach();
      });

      it("should impose parents' state", function () {
        binaryStateful.onDetach();
        expect(binaryStateful.isStateOn('foo')).toBeFalsy();
      });
    });

    describe("addBinaryState()", function () {
      beforeEach(function () {
        binaryStateful = BinaryStateful.create();
      });

      it("should return self", function () {
        var result = binaryStateful.addBinaryState('foo', true);
        expect(result).toBe(binaryStateful);
      });

      it("should add BinaryState instance to binaryStates", function () {
        binaryStateful.addBinaryState('foo', true);
        expect(binaryStateful.binaryStates.data).toEqual({
          foo: $widgets.BinaryState.fromStateName('foo', {cascades: true})
        });
      });
    });

    describe("addBinaryStateSourceId()", function () {
      beforeEach(function () {
        binaryStateful = BinaryStateful.create();
        binaryStateful.addBinaryState('foo', true);
      });

      it("should return self", function () {
        var result = binaryStateful.addBinaryStateSourceId('foo', 'bar');
        expect(result).toBe(binaryStateful);
      });

      it("should set Stateful state to true", function () {
        binaryStateful.addBinaryStateSourceId('foo', 'bar');
        expect(binaryStateful.state.foo).toBe(true);
      });

      describe("when cascading BinaryStateful has subtree", function () {
        var binaryStateful1,
            binaryStateful2,
            childWidget;

        beforeEach(function () {
          binaryStateful1 = BinaryStateful.create()
          .addBinaryState('foo');
          binaryStateful2 = BinaryStateful.create()
          .addBinaryState('foo');
          childWidget = $widget.Widget.create();

          binaryStateful
          .addChildNode(
              binaryStateful1
              .addChildNode(binaryStateful2)
              .addChildNode(childWidget));
        });

        it("should impose state on children", function () {
          binaryStateful.addBinaryStateSourceId('foo', 'bar');
          expect(binaryStateful1.isStateOn('foo')).toBeTruthy();
          expect(binaryStateful2.isStateOn('foo')).toBeTruthy();
        });
      });
    });

    describe("removeBinaryStateSourceId()", function () {
      beforeEach(function () {
        binaryStateful = BinaryStateful.create();
        binaryStateful.addBinaryState('foo', true);
        binaryStateful.addBinaryStateSourceId('foo', 'bar');
      });

      it("should return self", function () {
        var result = binaryStateful.removeBinaryStateSourceId('foo', 'bar');
        expect(result).toBe(binaryStateful);
      });

      it("should set Stateful state to false", function () {
        binaryStateful.removeBinaryStateSourceId('foo', 'bar');
        expect(binaryStateful.state.foo).toBe(false);
      });

      describe("when cascading BinaryStateful has subtree", function () {
        var binaryStateful1,
            binaryStateful2,
            childWidget;

        beforeEach(function () {
          binaryStateful1 = BinaryStateful.create()
          .addBinaryState('foo');
          binaryStateful2 = BinaryStateful.create()
          .addBinaryState('foo');
          childWidget = $widget.Widget.create();

          binaryStateful
          .addChildNode(
              binaryStateful1
              .addChildNode(binaryStateful2)
              .addChildNode(childWidget));

          binaryStateful.addBinaryStateSourceId('foo', 'bar');
        });

        it("should remove imposed state from children", function () {
          binaryStateful.removeBinaryStateSourceId('foo', 'bar');
          expect(binaryStateful1.isStateOn('foo')).toBeFalsy();
          expect(binaryStateful2.isStateOn('foo')).toBeFalsy();
        });
      });
    });

    describe("isStateOn()", function () {
      beforeEach(function () {
        binaryStateful = BinaryStateful.create();
        binaryStateful.addBinaryState('foo');
      });

      describe("when state does not exist", function () {
        it("should return falsy", function () {
          expect(binaryStateful.isStateOn('baz')).toBeFalsy();
        });
      });

      describe("when state is off", function () {
        it("should return falsy", function () {
          expect(binaryStateful.isStateOn('foo')).toBeFalsy();
        });
      });

      describe("when state is on", function () {
        beforeEach(function () {
          binaryStateful.addBinaryStateSourceId('foo', 'bar');
        });

        it("should return truthy", function () {
          expect(binaryStateful.isStateOn('foo')).toBeTruthy();
        });
      });
    });
  });
});
