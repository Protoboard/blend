"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'];

describe("$data", function () {
  describe("SetContainer", function () {
    var data,
        SetContainer,
        setContainer,
        result;

    beforeEach(function () {
      data = ['foo', 'bar'];

      SetContainer = $oop.getClass('test.$data.SetContainer.SetContainer')
      .mix($data.DataContainer)
      .mix($data.ArrayContainer)
      .mix($data.SetContainer)
      .define({
        setItem: function (value) {
          this.data.push(value);
        },
        forEachItem: function (callback, context) {
          this.data.forEach(callback, context);
        }
      });

      setContainer = SetContainer.create({data: data});
    });

    describe("fromArray()", function () {
      var array;

      beforeEach(function () {
        array = [1, 2, 3];
        result = SetContainer.fromArray(array);
      });

      it("should return a SetContainer instance", function () {
        expect(SetContainer.mixedBy(result)).toBeTruthy();
      });

      it("should initialize data buffer", function () {
        expect(result.data).not.toBe(array);
        expect(result.data).toEqual([1, 2, 3]);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = setContainer.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(setContainer);
      });

      it("should set data", function () {
        expect(result.data).not.toBe(setContainer.data);
        expect(result.data).toEqual(setContainer.data);
      });
    });

    describe("filter()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (value) {
          return value[0] === 'f';
        });
        result = setContainer.filter(callback);
      });

      it("should return instance of correct class", function () {
        expect(SetContainer.mixedBy(result)).toBeTruthy();
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['foo'],
          ['bar']
        ]);
      });

      it("should return filtered collection", function () {
        expect(result).not.toBe(setContainer);
        expect(result.data).toEqual(['foo']);
      });
    });

    describe("reduce()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and.callFake(
            function (reduced, value) {
              return reduced + value;
            });
        result = setContainer.reduce(callback, '');
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['', 'foo'],
          ['foo', 'bar']
        ]);
      });

      it("should return reduced value", function () {
        expect(result).toBe("foobar");
      });
    });
  });
});
