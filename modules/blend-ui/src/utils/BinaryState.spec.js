"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("BinaryState", function () {
    var BinaryState,
        binaryState;

    beforeAll(function () {
      BinaryState = $oop.createClass('test.$ui.BinaryState.BinaryState')
      .blend($ui.BinaryState)
      .build();
      BinaryState.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromStateName()", function () {
      it("should return BinaryState instance", function () {
        binaryState = BinaryState.fromStateName('foo');
        expect(BinaryState.mixedBy(binaryState)).toBeTruthy();
      });

      it("should initialize stateName", function () {
        binaryState = BinaryState.fromStateName('foo');
        expect(binaryState.stateName).toBe('foo');
      });
    });

    describe("create()", function () {
      describe("on invalid stateName", function () {
        it("should throw", function () {
          expect(function () {
            binaryState = BinaryState.create();
          }).toThrow();
        });
      });

      it("should initialize stateSources", function () {
        binaryState = BinaryState.create({stateName: 'foo'});
        expect($data.StringSet.mixedBy(binaryState.stateSourceIds))
        .toBeTruthy();
      });

      it("should initialize cascades", function () {
        binaryState = BinaryState.create({stateName: 'foo'});
        expect(binaryState.cascades).toBe(false);
      });
    });

    describe("addStateSourceId()", function () {
      beforeEach(function () {
        binaryState = BinaryState.fromStateName('foo');
      });

      it("should return self", function () {
        var result = binaryState.addStateSourceId('bar');
        expect(result).toBe(binaryState);
      });

      it("should set state source ID", function () {
        var result = binaryState.addStateSourceId('bar');
        expect(result.stateSourceIds.hasItem('bar')).toBeTruthy();
      });
    });

    describe("removeStateSourceId()", function () {
      beforeEach(function () {
        binaryState = BinaryState.fromStateName('foo');
        binaryState.addStateSourceId('bar');
      });

      it("should return self", function () {
        var result = binaryState.removeStateSourceId('bar');
        expect(result).toBe(binaryState);
      });

      it("should remove state source ID", function () {
        var result = binaryState.removeStateSourceId('bar');
        expect(result.stateSourceIds.hasItem('bar')).toBeFalsy();
      });
    });

    describe("isStateOn()", function () {
      beforeEach(function () {
        binaryState = BinaryState.fromStateName('foo');
      });

      describe("when stateSourceIds is empty", function () {
        it("should return falsy", function () {
          var result = binaryState.isStateOn();
          expect(result).toBeFalsy();
        });
      });

      describe("when stateSourceIds is not empty", function () {
        beforeEach(function () {
          binaryState.addStateSourceId('bar');
        });

        it("should return truthy", function () {
          var result = binaryState.isStateOn();
          expect(result).toBeTruthy();
        });
      });
    });
  });
});
