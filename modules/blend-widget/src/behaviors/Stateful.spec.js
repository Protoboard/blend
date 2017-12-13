"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("Stateful", function () {
    var Stateful,
        stateful;

    beforeAll(function () {
      Stateful = $oop.createClass('test.$widget.Stateful.Stateful')
      .blend($widget.Stateful)
      .build();
      Stateful.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize state container", function () {
        stateful = Stateful.create();
        expect(stateful.state).toEqual({});
      });
    });

    describe("setStateValue()", function () {
      beforeEach(function () {
        stateful = Stateful.create();
      });

      it("should return self", function () {
        var result = stateful.setStateValue('foo', 'bar');
        expect(result).toBe(stateful);
      });

      it("should set state value", function () {
        stateful.setStateValue('foo', 'bar');
        expect(stateful.state).toEqual({
          foo: 'bar'
        });
      });

      describe("when passing different value", function () {
        beforeEach(function () {
          stateful.setStateValue('foo', 'bar');
        });

        it("should save before state", function () {
          stateful.setStateValue('foo', 'baz');
          expect(stateful.setStateValue.shared.stateValueBefore).toBe('bar');
        });
      });
    });

    describe("getStateValue()", function () {
      beforeEach(function () {
        stateful.setStateValue('foo', 'bar');
      });

      it("should return state value", function () {
        var result = stateful.getStateValue('foo');
        expect(result).toBe('bar');
      });
    });
  });
});
