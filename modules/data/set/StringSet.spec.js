"use strict";

var $assert = window['giant-assert'],
  $oop = window['giant-oop'],
  $utils = window['giant-utils'],
  $data = window['giant-data'];

describe("$data", function () {
  var data,
    StringSet,
    set, set2,
    result;

  describe("StringSet", function () {
    beforeEach(function () {
      data = {
        foo: 1,
        bar: 1
      };
      StringSet = $oop.getClass("test.$data.StringSet.StringSet")
        .extend($data.StringSet);
      set = StringSet.create(data);
      set2 = StringSet.create({
        bar: 1,
        baz: 1
      });
    });

    describe("setItem()", function () {
      beforeEach(function () {
        set._itemCount = 2;
        result = set.setItem('baz');
      });

      it("should return self", function () {
        expect(result).toBe(set);
      });

      it("should add item", function () {
        expect(result._data).toEqual({
          foo: 1,
          bar: 1,
          baz: 1
        });
      });

      it("should increment _itemCount", function () {
        expect(result._itemCount).toBe(3);
      });

      describe("when re-adding existing item", function () {
        beforeEach(function () {
          set.setItem('foo');
        });

        it("should not increment _itemCount", function () {
          expect(result._itemCount).toBe(3);
        });
      });
    });

    describe("deleteItem()", function () {
      beforeEach(function () {
        set._itemCount = 2;
        result = set.deleteItem('bar');
      });

      it("should return self", function () {
        expect(result).toBe(set);
      });

      it("should delete item", function () {
        expect(result._data).toEqual({
          foo: 1
        });
      });

      it("should decrement _itemCount", function () {
        expect(result._itemCount).toBe(1);
      });

      describe("when deleting absent item", function () {
        beforeEach(function () {
          set.deleteItem('bar');
        });

        it("should not decrement _itemCount", function () {
          expect(result._itemCount).toBe(1);
        });
      });
    });

    describe("hasItem()", function () {
      describe("for existing item", function () {
        it("should return true", function () {
          expect(set.hasItem('foo')).toBeTruthy();
        });
      });
      describe("for absent item", function () {
        it("should return false", function () {
          expect(set.hasItem('baz')).toBeFalsy();
        });
      });
    });

    describe("forEachItem()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy();
        result = set.forEachItem(callback);
      });

      it("should return self", function () {
        expect(result).toBe(set);
      });

      it("should pass items to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['foo'],
          ['bar']
        ]);
      });

      describe("when interrupted", function () {
        beforeEach(function () {
          callback = jasmine.createSpy().and.returnValue(false);
          set.forEachItem(callback);
        });

        it("should stop at interruption", function () {
          expect(callback).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("intersectWith()", function () {
      beforeEach(function () {
        result = set.intersectWith(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.isIncludedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should create intersection with values from original set",
        function () {
          expect(result._data).toEqual({
            bar: 1
          });
        });
    });

    describe("uniteWith()", function () {
      beforeEach(function () {
        result = set.uniteWith(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.isIncludedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should create union with original values taking precedence",
        function () {
          expect(result._data).toEqual({
            foo: 1,
            bar: 1,
            baz: 1
          });
        });
    });

    describe("subtract()", function () {
      beforeEach(function () {
        result = set.subtract(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.isIncludedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should subtract set from original", function () {
        expect(result._data).toEqual({
          foo: 1
        });
      });
    });

    describe("subtractFrom()", function () {
      beforeEach(function () {
        result = set.subtractFrom(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.isIncludedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should subtract set from original", function () {
        expect(result._data).toEqual({
          baz: 1
        });
      });
    });

    describe("takeDifferenceWith()", function () {
      beforeEach(function () {
        result = set.takeDifferenceWith(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.isIncludedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should return symmetric difference", function () {
        expect(result._data).toEqual({
          foo: 1,
          baz: 1
        });
      });
    });
  });

  describe("DataContainer", function () {
    describe("toStringSet()", function () {
      var buffer = $data.DataContainer.create([1, 2, 3]);

      beforeEach(function () {
        result = buffer.toStringSet();
      });

      it("should return a StringSet instance", function () {
        expect($data.StringSet.isIncludedBy(result)).toBeTruthy();
      });

      it("should set data set", function () {
        expect(result._data).toBe(buffer._data);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("toStringSet()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.toStringSet();
    });

    it("should return a StringSet instance", function () {
      expect($data.StringSet.isIncludedBy(result)).toBeTruthy();
    });

    it("should set data set", function () {
      expect(result._data).toBe(array);
    });
  });
});
