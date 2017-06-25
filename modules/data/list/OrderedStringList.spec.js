"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
  var data,
      OrderedStringList,
      orderedStringList,
      result;

  describe("OrderedStringList", function () {
    var comparer;

    beforeEach(function () {
      data = ['bar', 'foo'];
      OrderedStringList = $oop.getClass("test.$data.OrderedStringList.OrderedStringList")
      .extend($data.OrderedStringList);
      orderedStringList = OrderedStringList.create(data);
    });

    describe("getRangeByPrefix()", function () {
      beforeEach(function () {
        orderedStringList
        .setItem('baz')
        .setItem('quux')
        .setItem('hello')
        .setItem('world')
        .setItem('lorem')
        .setItem('ipsum');

        result = orderedStringList.getRangeByPrefix('b');
      });

      it("should return range matching prefix", function () {
        expect(result).toEqual([
          'bar', 'baz'
        ]);
      });
    });

    describe("getRangeByPrefixWrapped()", function () {
      var data;

      beforeEach(function () {
        data = [];
        spyOn(orderedStringList, 'getRangeByPrefix').and
        .returnValue(data);
        result = orderedStringList.getRangeByPrefixWrapped('foo', 10, 5);
      });

      it("should return instance of the current class", function () {
        expect(OrderedStringList.isIncludedBy(result)).toBeTruthy();
      });

      it("should invoke getRangeByPrefix() with same arguments", function () {
        expect(orderedStringList.getRangeByPrefix).toHaveBeenCalledWith(
            'foo', 10, 5);
      });

      it("should wrap result of getRangeByPrefix()", function () {
        expect(result.data).toBe(data);
      });
    });
  });

  describe("DataContainer", function () {
    describe("toOrderedStringList()", function () {
      var buffer = $data.DataContainer.create([1, 2, 3]);

      beforeEach(function () {
        result = buffer.toOrderedStringList();
      });

      it("should return a OrderedStringList instance", function () {
        expect($data.OrderedStringList.isIncludedBy(result)).toBeTruthy();
      });

      it("should set data set", function () {
        expect(result.data).toBe(buffer.data);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("toOrderedStringList()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.toOrderedStringList();
    });

    it("should return a OrderedStringList instance", function () {
      expect($data.OrderedStringList.isIncludedBy(result)).toBeTruthy();
    });

    it("should set data set", function () {
      expect(result.data).toBe(array);
    });
  });
});
