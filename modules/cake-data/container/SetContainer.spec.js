"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'];

describe("$data", function () {
  describe("SetContainer", function () {
    var data,
        SetContainer,
        setContainer,
        result;

    beforeAll(function () {
      SetContainer = $oop.getClass('test.$data.SetContainer.SetContainer')
      .blend($data.DataContainer)
      .blend($data.ArrayContainer)
      .blend($data.SetContainer)
      .define({
        setItem: function (item) {
          this.data.push(item);
        },
        forEachItem: function (callback, context) {
          this.data.forEach(callback, context);
        }
      });
    });

    beforeEach(function () {
      data = ['foo', 'bar'];

      setContainer = SetContainer.create({data: data});
    });

    describe("fromArray()", function () {
      var array;

      beforeEach(function () {
        array = [1, 2, 3];
        result = SetContainer.fromArray(array);
      });

      it("should return a SetContainer instance", function () {
        expect(SetContainer.mixedBy(result)).toBeTruthy();
      });

      it("should initialize data buffer", function () {
        expect(result.data).not.toBe(array);
        expect(result.data).toEqual([1, 2, 3]);
      });
    });

    describe("fromSetContainer()", function () {
      var SetContainer2,
          setContainer2;

      beforeAll(function () {
        SetContainer2 = $oop.getClass('test.$data.SetContainer.SetContainer2')
        .blend($data.DataContainer)
        .blend($data.ObjectContainer)
        .blend($data.SetContainer)
        .define({
          setItem: function (item) {
            this.data[item] = 1;
          },
          forEachItem: function (callback, context) {
            callback = context ? callback.bind(context) : callback;
            Object.keys(this.data).forEach(callback);
          }
        });
      });

      beforeEach(function () {
        setContainer2 = SetContainer2.fromData({
          "foo": 1,
          "bar": 1
        });

        result = SetContainer.fromSetContainer(setContainer2);
      });

      it("should return instance of appropriate class", function () {
        expect(SetContainer.mixedBy(result)).toBeTruthy();
      });

      it("should transfer data", function () {
        expect(result.data).toEqual(["foo", "bar"]);
      });
    });

    describe("fromKeyValueContainer", function () {
      var KeyValueContainer,
          keyValueContainer;

      beforeAll(function () {
        KeyValueContainer = $oop.getClass('test.$data.SetContainer.KeyValueContainer')
        .blend($data.DataContainer)
        .blend($data.ArrayContainer)
        .blend($data.KeyValueContainer)
        .define({
          setItem: function (key, value) {
            this.data.push([key, value]);
          },
          forEachItem: function (callback, context) {
            callback = context ? callback.bind(context) : callback;
            this.data.forEach(function (item, i) {
              callback(item[1], i);
            });
          }
        });
      });

      beforeEach(function () {
        keyValueContainer = KeyValueContainer.fromData([
          [1, "foo"],
          [2, "bar"]
        ]);

        result = SetContainer.fromKeyValueContainer(keyValueContainer);
      });

      it("should return instance of appropriate class", function () {
        expect(SetContainer.mixedBy(result)).toBeTruthy();
      });

      it("should transfer data", function () {
        expect(result.data).toEqual(["foo", "bar"]);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = setContainer.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(setContainer);
      });

      it("should set data", function () {
        expect(result.data).not.toBe(setContainer.data);
        expect(result.data).toEqual(setContainer.data);
      });
    });

    describe("filter()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (value) {
          return value[0] === 'f';
        });
        result = setContainer.filter(callback);
      });

      it("should return instance of correct class", function () {
        expect(SetContainer.mixedBy(result)).toBeTruthy();
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['foo'],
          ['bar']
        ]);
      });

      it("should return filtered collection", function () {
        expect(result).not.toBe(setContainer);
        expect(result.data).toEqual(['foo']);
      });
    });

    describe("reduce()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and.callFake(
            function (reduced, value) {
              return reduced + value;
            });
        result = setContainer.reduce(callback, '');
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['', 'foo'],
          ['foo', 'bar']
        ]);
      });

      it("should return reduced value", function () {
        expect(result).toBe("foobar");
      });
    });

    describe("to()", function () {
      var SetConvertible,
          transformed;

      beforeAll(function () {
        SetConvertible = $oop.getClass('test.$data.SetContainer.SetConvertible')
        .blend($data.DataContainer)
        .blend($data.SetConvertible);
      });

      beforeEach(function () {
        transformed = {};

        spyOn(SetConvertible, 'fromSetContainer').and.returnValue(transformed);

        result = setContainer.to(SetConvertible);
      });

      it("should invoke fromKeyValueContainer() on target class", function () {
        expect(SetConvertible.fromSetContainer)
        .toHaveBeenCalledWith(setContainer);
      });

      it("should return conversion result", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});
