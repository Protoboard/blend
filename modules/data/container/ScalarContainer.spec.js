"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
  describe("ScalarContainer", function () {
    var data,
        ScalarContainer,
        scalarContainer,
        result;

    beforeEach(function () {
      data = ['foo', 'bar'];

      ScalarContainer = $oop.getClass('test.$data.ScalarContainer.ScalarContainer')
      .extend($data.DataContainer)
      .extend($data.ScalarContainer)
      .define({
        setItem: function (value) {
          this.data.push(value);
        },
        forEachItem: function (callback, context) {
          this.data.forEach(callback, context);
        }
      });

      scalarContainer = ScalarContainer.create(data);
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
        expect(ScalarContainer.isIncludedBy(result)).toBeTruthy();
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
