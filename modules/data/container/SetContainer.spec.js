"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'];

describe("$data", function () {
  describe("SetContainer", function () {
    var data,
        SetContainer,
        scalarContainer,
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

      scalarContainer = SetContainer.create(data);
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = scalarContainer.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(scalarContainer);
      });

      it("should set data", function () {
        expect(result.data).not.toBe(scalarContainer.data);
        expect(result.data).toEqual(scalarContainer.data);
      });
    });

    describe("filter()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (value) {
          return value[0] === 'f';
        });
        result = scalarContainer.filter(callback);
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
        expect(result).not.toBe(scalarContainer);
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
        result = scalarContainer.reduce(callback, '');
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
