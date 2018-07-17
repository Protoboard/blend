"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $data = window['blend-data'];

describe("$data", function () {
  var result;

  describe("StringSet", function () {
    var data,
        StringSet,
        set, set2;

    beforeAll(function () {
      StringSet = $oop.createClass("test.$data.StringSet.StringSet")
      .blend($data.StringSet)
      .build();
    });

    beforeEach(function () {
      data = {
        foo: 1,
        bar: 1
      };
      set = StringSet.create({data: data});
      set2 = StringSet.create({
        data: {
          bar: 1,
          baz: 1
        }
      });
    });

    describe(".create()", function () {
      describe("on missing arguments", function () {
        it("should initialize data to empty object", function () {
          set = StringSet.create();
          expect(set.data).toEqual({});
        });
      });
    });

    describe("#setItem()", function () {
      beforeEach(function () {
        set._itemCount = 2;
        result = set.setItem('baz');
      });

      it("should return self", function () {
        expect(result).toBe(set);
      });

      it("should add item", function () {
        expect(result.data).toEqual({
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

    describe("#deleteItem()", function () {
      beforeEach(function () {
        set._itemCount = 2;
        result = set.deleteItem('bar');
      });

      it("should return self", function () {
        expect(result).toBe(set);
      });

      it("should delete item", function () {
        expect(result.data).toEqual({
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

    describe("#hasItem()", function () {
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

    describe("#forEachItem()", function () {
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

    describe("#intersectWith()", function () {
      beforeEach(function () {
        result = set.intersectWith(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.mixedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should create intersection with values from original set",
          function () {
            expect(result.data).toEqual({
              bar: 1
            });
          });
    });

    describe("#uniteWith()", function () {
      beforeEach(function () {
        result = set.uniteWith(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.mixedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should create union with original values taking precedence",
          function () {
            expect(result.data).toEqual({
              foo: 1,
              bar: 1,
              baz: 1
            });
          });
    });

    describe("#subtract()", function () {
      beforeEach(function () {
        result = set.subtract(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.mixedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should subtract set from original", function () {
        expect(result.data).toEqual({
          foo: 1
        });
      });
    });

    describe("#subtractFrom()", function () {
      beforeEach(function () {
        result = set.subtractFrom(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.mixedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should subtract set from original", function () {
        expect(result.data).toEqual({
          baz: 1
        });
      });
    });

    describe("#takeDifferenceWith()", function () {
      beforeEach(function () {
        result = set.takeDifferenceWith(set2);
      });

      it("should return new StringSet instance", function () {
        expect(StringSet.mixedBy(result));
        expect(result).not.toBe(set);
        expect(result).not.toBe(set2);
      });

      it("should return symmetric difference", function () {
        expect(result.data).toEqual({
          foo: 1,
          baz: 1
        });
      });
    });
  });

  describe("DataContainer", function () {
    var result;

    describe("#asStringSet()", function () {
      var buffer;

      beforeEach(function () {
        buffer = $data.DataContainer.create({data: [1, 2, 3]});
        result = buffer.asStringSet();
      });

      it("should return a StringSet instance", function () {
        expect($data.StringSet.mixedBy(result)).toBeTruthy();
      });

      it("should set data set", function () {
        expect(result.data).toBe(buffer.data);
      });
    });
  });

  describe("SetContainer", function () {
    describe("#toStringSet()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toStringSet();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.StringSet);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("#toStringSet()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toStringSet();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.StringSet);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("#toStringSet()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.toStringSet();
    });

    it("should return a StringSet instance", function () {
      expect($data.StringSet.mixedBy(result)).toBeTruthy();
    });

    it("should set data set", function () {
      expect(result.data).toEqual({
        1: 1,
        2: 1,
        3: 1
      });
    });
  });
});
