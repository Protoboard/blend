"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("Wrapper", function () {
    var Wrapper,
        wrapper,
        result;

    beforeEach(function () {
      Wrapper = $oop.getClass('test.$event.Wrapper.Wrapper')
      .mix($utils.Cloneable)
      .mix($event.Wrapper);

      wrapper = Wrapper.create({eventName: 'event1'});
    });

    describe("create()", function () {
      it("should initialize wrapped", function () {
        expect(wrapper.hasOwnProperty('wrapped')).toBeTruthy();
      });
    });

    describe("clone()", function () {
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

    describe("wrap()", function () {
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
