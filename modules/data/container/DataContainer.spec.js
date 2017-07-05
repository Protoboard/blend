"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
  describe("DataContainer", function () {
    var DataContainer,
        container,
        result;

    beforeEach(function () {
      DataContainer = $oop.getClass("test.$data.DataContainer.DataContainer")
      .mix($data.DataContainer);
      container = DataContainer.create(null);
    });

    describe("create()", function () {
      it("should set data property", function () {
        expect(container.data).toBe(null);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = container.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(container);
      });

      it("should set data", function () {
        expect(result.data).toBe(container.data);
      });
    });

    describe("destroy()", function () {
      beforeEach(function () {
        spyOn(container, 'clear');
        result = container.destroy();
      });

      it("should return self", function () {
        expect(result).toBe(container);
      });

      it("should clear data", function () {
        expect(container.clear).toHaveBeenCalled();
      });
    });

    describe("clear()", function () {
      beforeEach(function () {
        result = container.clear();
      });

      it("should return self", function () {
        expect(result).toBe(container);
      });

      it("should replace data with undefined", function () {
        expect(container.data).toEqual(undefined);
      });
    });

    describe("isEmpty()", function () {
      describe("when data is defined", function () {
        it("should return false", function () {
          expect(DataContainer.create(1).isEmpty()).toBeFalsy();
        });
      });

      describe("when data is undefined", function () {
        it("should return false", function () {
          expect(DataContainer.create().isEmpty()).toBeTruthy();
        });
      });
    });

    describe("passDataTo()", function () {
      var callback,
          returnValue;

      beforeEach(function () {
        returnValue = {};
        callback = jasmine.createSpy().and.returnValue(returnValue);
        result = container.passDataTo(callback);
      });

      it("should pass data to callback", function () {
        expect(callback).toHaveBeenCalledWith(container.data);
      });

      it("should return return value of callback", function () {
        expect(result).toBe(returnValue);
      });
    });

    describe("passSelfTo()", function () {
      var callback,
          returnValue;

      beforeEach(function () {
        returnValue = {};
        callback = jasmine.createSpy().and.returnValue(returnValue);
        result = container.passSelfTo(callback);
      });

      it("should pass data to callback", function () {
        expect(callback).toHaveBeenCalledWith(container);
      });

      it("should return return value of callback", function () {
        expect(result).toBe(returnValue);
      });
    });
  });
});
