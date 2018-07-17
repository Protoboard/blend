"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $data = window['blend-data'];

describe("$data", function () {
  var data,
      PairList,
      pairList,
      result;

  describe("PairList", function () {
    beforeAll(function () {
      PairList = $oop.createClass("test.$data.PairList.PairList")
      .blend($data.PairList)
      .build();
    });

    beforeEach(function () {
      data = [
        {key: "foo", value: "FOO"},
        {key: "bar", value: "BAR"}
      ];
      pairList = PairList.create({data: data});
    });

    describe(".create()", function () {
      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            PairList.create({data: {}});
          }).toThrow();
        });
      });

      describe("on missing arguments", function () {
        it("should initialize data to empty array", function () {
          pairList = PairList.create();
          expect(pairList.data).toEqual([]);
        });
      });
    });

    describe("#setItem()", function () {
      var value = {};

      beforeEach(function () {
        result = pairList.setItem('baz', value);
      });

      it("should return self", function () {
        expect(result).toBe(pairList);
      });

      it("should set value in store", function () {
        expect(pairList.data).toEqual([
          {key: "foo", value: "FOO"},
          {key: "bar", value: "BAR"},
          {key: "baz", value: value}
        ]);
      });
    });

    describe("#deleteItem()", function () {
      it("should throw", function () {
        expect(function () {
          pairList.deleteItem('foo', "FOO");
        }).toThrow();
      });
    });

    describe("#hasItem()", function () {
      it("should throw", function () {
        expect(function () {
          pairList.hasItem('foo', "FOO");
        }).toThrow();
      });
    });

    describe("#forEachItem()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy();
        result = pairList.forEachItem(callback);
      });

      it("should return self", function () {
        expect(result).toBe(pairList);
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
          pairList.forEachItem(callback);
        });

        it("should stop at interruption", function () {
          expect(callback).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("DataContainer", function () {
    describe("#asPairList()", function () {
      var container = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = container.asPairList();
      });

      it("should return a PairList instance", function () {
        expect($data.PairList.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result.data).toBe(container.data);
      });
    });
  });

  describe("SetContainer", function () {
    describe("#toPairList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toPairList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.PairList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("#toPairList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.PairList.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toPairList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.PairList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("#asPairList()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.asPairList();
    });

    it("should return a PairList instance", function () {
      expect($data.PairList.mixedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
