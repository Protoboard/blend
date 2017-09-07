"use strict";

var $assert = window['cake-assert'],
    $data = window['cake-data'];

describe("$data", function () {
  describe("DataContainer", function () {
    var DataContainer,
        container,
        result;

    beforeEach(function () {
      DataContainer = $oop.getClass("test.$data.DataContainer.DataContainer")
      .mix($data.DataContainer);
      container = DataContainer.create({data: null});
    });

    describe("fromData()", function () {
      var data = {};
      beforeEach(function () {
        spyOn(DataContainer, 'create').and.returnValue(container);
        result = DataContainer.fromData(data);
      });

      it("should pass data to create()", function () {
        expect(DataContainer.create).toHaveBeenCalledWith({data: data});
      });

      it("should return result of create()", function () {
        expect(result).toBe(container);
      });
    });

    describe("as()", function () {
      var DataContainer2;

      beforeEach(function () {
        DataContainer2 = $oop.getClass("test.$data.DataContainer.DataContainer2")
        .mix($data.DataContainer);
        result = container.as(DataContainer2);
      });

      it("should return instance of specified class", function () {
        expect(DataContainer2.mixedBy(result)).toBeTruthy();
      });

      it("should set data property", function () {
        expect(result.data).toBe(null);
      });
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
          expect(DataContainer.create({data: 1}).isEmpty()).toBeFalsy();
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
