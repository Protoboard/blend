"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'];

describe("$data", function () {
  var data,
      OrderedStringList,
      orderedStringList,
      result;

  describe("OrderedStringList", function () {
    beforeAll(function () {
      OrderedStringList = $oop.getClass("test.$data.OrderedStringList.OrderedStringList")
      .mix($data.OrderedStringList);
    });

    beforeEach(function () {
      data = ['bar', 'foo'];
      orderedStringList = OrderedStringList.create({data: data});
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
        expect(OrderedStringList.mixedBy(result)).toBeTruthy();
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
    describe("asOrderedStringList()", function () {
      var buffer = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = buffer.asOrderedStringList();
      });

      it("should return a OrderedStringList instance", function () {
        expect($data.OrderedStringList.mixedBy(result)).toBeTruthy();
      });

      it("should set data set", function () {
        expect(result.data).toBe(buffer.data);
      });
    });
  });

  describe("SetContainer", function () {
    describe("toOrderedStringList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toOrderedStringList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.OrderedStringList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("toOrderedStringList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.OrderedStringList.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toOrderedStringList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.OrderedStringList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("asOrderedStringList()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.asOrderedStringList();
    });

    it("should return a OrderedStringList instance", function () {
      expect($data.OrderedStringList.mixedBy(result)).toBeTruthy();
    });

    it("should set data set", function () {
      expect(result.data).toBe(array);
    });
  });
});
