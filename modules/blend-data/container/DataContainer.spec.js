"use strict";

var $assert = window['blend-assert'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("DataContainer", function () {
    var DataContainer,
        dataContainer,
        result;

    beforeAll(function () {
      DataContainer = $oop.getClass("test.$data.DataContainer.DataContainer")
      .blend($data.DataContainer);
    });

    beforeEach(function () {
      dataContainer = DataContainer.create({data: null});
    });

    describe("fromData()", function () {
      var data = {};

      it("should return DataContainer instance", function () {
        dataContainer = DataContainer.fromData('foo');
        expect(DataContainer.mixedBy(dataContainer)).toBeTruthy();
      });

      it("should set data", function () {
        dataContainer = DataContainer.fromData(data);
        expect(dataContainer.data).toBe(data);
      });

      it("should pass additional properties to create", function () {
        dataContainer = DataContainer.fromData(data, {bar: 'baz'});
        expect(dataContainer.bar).toBe('baz');
      });
    });

    describe("as()", function () {
      var DataContainer2;

      beforeAll(function () {
        DataContainer2 = $oop.getClass("test.$data.DataContainer.DataContainer2")
        .blend($data.DataContainer);
      });

      beforeEach(function () {
        result = dataContainer.as(DataContainer2);
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
        expect(dataContainer.data).toBe(null);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = dataContainer.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(dataContainer);
      });

      it("should set data", function () {
        expect(result.data).toBe(dataContainer.data);
      });
    });

    describe("destroy()", function () {
      beforeEach(function () {
        spyOn(dataContainer, 'clear');
        result = dataContainer.destroy();
      });

      it("should return self", function () {
        expect(result).toBe(dataContainer);
      });

      it("should clear data", function () {
        expect(dataContainer.clear).toHaveBeenCalled();
      });
    });

    describe("clear()", function () {
      beforeEach(function () {
        result = dataContainer.clear();
      });

      it("should return self", function () {
        expect(result).toBe(dataContainer);
      });

      it("should replace data with undefined", function () {
        expect(dataContainer.data).toEqual(undefined);
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
        result = dataContainer.passDataTo(callback);
      });

      it("should pass data to callback", function () {
        expect(callback).toHaveBeenCalledWith(dataContainer.data);
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
        result = dataContainer.passSelfTo(callback);
      });

      it("should pass data to callback", function () {
        expect(callback).toHaveBeenCalledWith(dataContainer);
      });

      it("should return return value of callback", function () {
        expect(result).toBe(returnValue);
      });
    });
  });
});
