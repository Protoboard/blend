"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("Wrapper", function () {
    var Wrapper,
        wrapper,
        result;

    beforeAll(function () {
      Wrapper = $oop.createClass('test.$event.Wrapper.Wrapper')
      .blend($utils.Cloneable)
      .blend($event.Wrapper)
      .build();
    });

    beforeEach(function () {
      wrapper = Wrapper.create({eventName: 'event1'});
    });

    describe("#clone()", function () {
      beforeEach(function () {
        wrapper.wrapped = {};
        result = wrapper.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(wrapper);
      });

      it("should be equivalent", function () {
        expect(result.wrapped).toBe(wrapper.wrapped);
      });
    });

    describe("#wrap()", function () {
      var wrapped;

      beforeEach(function () {
        wrapped = {};
        result = wrapper.wrap(wrapped);
      });

      it("should return self", function () {
        expect(result).toBe(wrapper);
      });

      it("should set wrapped", function () {
        expect(wrapper.wrapped).toBe(wrapped);
      });
    });
  });
});
