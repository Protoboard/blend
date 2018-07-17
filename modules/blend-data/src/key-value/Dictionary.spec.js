"use strict";

var $assert = window['blend-assert'],
    $data = window['blend-data'];

describe("$data", function () {
  var data,
      Dictionary,
      dictionary,
      result;

  describe("Dictionary", function () {
    beforeAll(function () {
      Dictionary = $oop.createClass("test.$data.Dictionary.Dictionary")
      .blend($data.Dictionary)
      .build();
    });

    beforeEach(function () {
      data = {
        foo: ["FOO"],
        bar: ["BAR", "bar"]
      };
      dictionary = Dictionary.create({data: data});
      dictionary._itemCount = 3;
    });

    describe(".create()", function () {
      describe("on missing arguments", function () {
        it("should initialize data to empty object", function () {
          dictionary = Dictionary.create();
          expect(dictionary.data).toEqual({});
        });
      });
    });

    describe("#setItem()", function () {
      beforeEach(function () {
        result = dictionary.setItem('baz', "BAZ");
      });

      it("should return self", function () {
        expect(result).toBe(dictionary);
      });

      it("should add item", function () {
        expect(dictionary.data).toEqual({
          foo: ["FOO"],
          bar: ["BAR", "bar"],
          baz: ["BAZ"]
        });
      });

      it("should increment _itemCount", function () {
        expect(dictionary._itemCount).toBe(4);
      });

      describe("when adding to existing key", function () {
        beforeEach(function () {
          dictionary.setItem('foo', 'foo');
        });

        it("should add to array", function () {
          expect(dictionary.data).toEqual({
            foo: ["FOO", "foo"],
            bar: ["BAR", "bar"],
            baz: ["BAZ"]
          });
        });

        it("should increment _itemCount", function () {
          expect(dictionary._itemCount).toBe(5);
        });
      });
    });

    describe("#deleteItem()", function () {
      beforeEach(function () {
        result = dictionary.deleteItem('bar', 'bar');
      });

      it("should return self", function () {
        expect(result).toBe(dictionary);
      });

      it("should remove item", function () {
        expect(dictionary.data).toEqual({
          foo: ["FOO"],
          bar: ["BAR"]
        });
      });

      it("should decrement _itemCount", function () {
        expect(dictionary._itemCount).toBe(2);
      });

      describe("when removing last pair for a key", function () {
        beforeEach(function () {
          dictionary.deleteItem('foo', 'FOO');
        });

        it("should remove item", function () {
          expect(dictionary.data).toEqual({
            bar: ["BAR"]
          });
        });
      });

      describe("when removing absent key-value pair", function () {
        beforeEach(function () {
          dictionary.deleteItem('bar', 'QUUX');
          dictionary.deleteItem('baz', 'BAZ');
        });

        it("should not change data", function () {
          expect(dictionary.data).toEqual({
            foo: ["FOO"],
            bar: ["BAR"]
          });
        });
      });
    });

    describe("#hasItem()", function () {
      describe("for existing item", function () {
        it("should return true", function () {
          expect(dictionary.hasItem('foo', 'FOO')).toBeTruthy();
        });
      });
      describe("for absent item", function () {
        it("should return false", function () {
          expect(dictionary.hasItem('foo', 'foo')).toBeFalsy();
        });
      });
    });

    describe("#forEachItem()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy();
        result = dictionary.forEachItem(callback);
      });

      it("should return self", function () {
        expect(result).toBe(dictionary);
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ["FOO", 'foo'],
          ["BAR", 'bar'],
          ["bar", 'bar']
        ]);
      });

      describe("when interrupted", function () {
        beforeEach(function () {
          callback = jasmine.createSpy().and.returnValue(false);
          dictionary.forEachItem(callback);
        });

        it("should stop at interruption", function () {
          expect(callback).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("#getValuesForKey()", function () {
      beforeEach(function () {
        result = dictionary.getValuesForKey('foo');
      });

      it("should return corresponding values", function () {
        expect(result).toEqual(["FOO"]);
      });

      describe("on absent key", function () {
        beforeEach(function () {
          result = dictionary.getValuesForKey('baz');
        });

        it("should return empty array", function () {
          expect(result).toEqual([]);
        });
      });
    });
  });

  describe("DataContainer", function () {
    describe("#asDictionary()", function () {
      var container = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = container.asDictionary();
      });

      it("should return a Dictionary instance", function () {
        expect($data.Dictionary.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result.data).toBe(container.data);
      });
    });
  });

  describe("SetContainer", function () {
    describe("#toDictionary()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toDictionary();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.Dictionary);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("#toDictionary()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.PairList.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toDictionary();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.Dictionary);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("#asDictionary()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.asDictionary();
    });

    it("should return a Dictionary instance", function () {
      expect($data.Dictionary.mixedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
