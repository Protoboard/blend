"use strict";

var $assert = window['cake-assert'],
    $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $data = window['cake-data'];

describe("$data", function () {
  var data,
      Collection,
      collection,
      result;

  describe("Collection", function () {
    beforeEach(function () {
      data = {
        foo: "FOO",
        bar: "BAR"
      };
      Collection = $oop.getClass("test.$data.Collection.Collection")
      .mix($data.Collection);
      collection = Collection.create({data: data});
    });

    describe("create()", function () {
      describe("on missing arguments", function () {
        it("should initialize data to empty object", function () {
          collection = Collection.create();
          expect(collection.data).toEqual({});
        });
      });
    });

    describe("setItem()", function () {
      var value = {};

      beforeEach(function () {
        result = collection.setItem('baz', value);
      });

      it("should return self", function () {
        expect(result).toBe(collection);
      });

      it("should set value in store", function () {
        expect(collection.data.baz).toBe(value);
      });
    });

    describe("deleteItem()", function () {
      beforeEach(function () {
        result = collection.deleteItem('foo');
      });

      it("should return self", function () {
        expect(result).toBe(collection);
      });

      it("should remove key", function () {
        expect(collection.data.hasOwnProperty('foo')).toBeFalsy();
      });

      describe("when specifying value", function () {
        describe("when value doesn't match", function () {
          it("should not remove key", function () {
            collection.deleteItem('bar', 'bar');
            expect(collection.data).toEqual({
              bar: "BAR"
            });
          });
        });
      });
    });

    describe("forEachItem()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy();
        result = collection.forEachItem(callback);
      });

      it("should return self", function () {
        expect(result).toBe(collection);
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['FOO', 'foo'],
          ['BAR', 'bar']
        ]);
      });

      describe("when interrupted", function () {
        beforeEach(function () {
          callback = jasmine.createSpy().and.returnValue(false);
          collection.forEachItem(callback);
        });

        it("should stop at interruption", function () {
          expect(callback).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("getValuesForKey()", function () {
      beforeEach(function () {
        result = collection.getValuesForKey('foo');
      });

      it("should return corresponding values", function () {
        expect(result).toEqual(["FOO"]);
      });

      describe("on absent key", function () {
        beforeEach(function () {
          result = collection.getValuesForKey('baz');
        });

        it("should return empty array", function () {
          expect(result).toEqual([]);
        });
      });
    });

    describe("getValue()", function () {
      it("should return corresponding value", function () {
        expect(collection.getValue('foo')).toBe("FOO");
      });
    });

    describe("getValueWrapped()", function () {
      var data;

      beforeEach(function () {
        data = {};
        spyOn(collection, 'getValue').and.returnValue(data);
        result = collection.getValueWrapped('foo');
      });

      it("should return DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result))
        .toBeTruthy();
      });

      it("should invoke getValue()", function () {
        expect(collection.getValue).toHaveBeenCalledWith('foo');
      });

      it("should wrap result of getValue()", function () {
        expect(result.data).toBe(data);
      });
    });
  });

  describe("DataContainer", function () {
    describe("asCollection()", function () {
      var container = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = container.asCollection();
      });

      it("should return a Collection instance", function () {
        expect($data.Collection.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result.data).toBe(container.data);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("asCollection()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.asCollection();
    });

    it("should return a Collection instance", function () {
      expect($data.Collection.mixedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
