"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("SetContainer", function () {
    var data,
        SetContainer,
        setContainer,
        result;

    beforeAll(function () {
      SetContainer = $oop.createClass('test.$data.SetContainer.SetContainer')
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
      })
      .build();
    });

    beforeEach(function () {
      data = ['foo', 'bar'];

      setContainer = SetContainer.create({data: data});
    });

    describe(".fromArray()", function () {
      var array;

      beforeEach(function () {
        array = [1, 2, 3];
      });

      it("should return a SetContainer instance", function () {
        setContainer = SetContainer.fromArray(array);
        expect(SetContainer.mixedBy(setContainer)).toBeTruthy();
      });

      it("should initialize data buffer", function () {
        setContainer = SetContainer.fromArray(array);
        expect(setContainer.data).not.toBe(array);
        expect(setContainer.data).toEqual([1, 2, 3]);
      });

      it("should pass additional properties to create", function () {
        setContainer = SetContainer.fromArray(array, {bar: 'baz'});
        expect(setContainer.bar).toBe('baz');
      });
    });

    describe(".fromSetContainer()", function () {
      var SetContainer2,
          setContainer2;

      beforeAll(function () {
        SetContainer2 = $oop.createClass('test.$data.SetContainer.SetContainer2')
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
        })
        .build();
      });

      beforeEach(function () {
        setContainer2 = SetContainer2.fromData({
          "foo": 1,
          "bar": 1
        });
      });

      it("should return instance of appropriate class", function () {
        setContainer = SetContainer.fromSetContainer(setContainer2);
        expect(SetContainer.mixedBy(setContainer)).toBeTruthy();
      });

      it("should transfer data", function () {
        setContainer = SetContainer.fromSetContainer(setContainer2);
        expect(setContainer.data).toEqual(["foo", "bar"]);
      });

      it("should pass additional properties to create", function () {
        setContainer = SetContainer.fromSetContainer(setContainer2, {bar: 'baz'});
        expect(setContainer.bar).toBe('baz');
      });
    });

    describe(".fromKeyValueContainer", function () {
      var KeyValueContainer,
          keyValueContainer;

      beforeAll(function () {
        KeyValueContainer = $oop.createClass('test.$data.SetContainer.KeyValueContainer')
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
        })
        .build();
      });

      beforeEach(function () {
        keyValueContainer = KeyValueContainer.fromData([
          [1, "foo"],
          [2, "bar"]
        ]);
      });

      it("should return instance of appropriate class", function () {
        setContainer = SetContainer.fromKeyValueContainer(keyValueContainer);
        expect(SetContainer.mixedBy(setContainer)).toBeTruthy();
      });

      it("should transfer data", function () {
        setContainer = SetContainer.fromKeyValueContainer(keyValueContainer);
        expect(setContainer.data).toEqual(["foo", "bar"]);
      });

      it("should pass additional properties to create", function () {
        setContainer = SetContainer.fromKeyValueContainer(keyValueContainer, {bar: 'baz'});
        expect(setContainer.bar).toBe('baz');
      });
    });

    describe("#clone()", function () {
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

    describe("#filter()", function () {
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

    describe("#reduce()", function () {
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

    describe("#to()", function () {
      var SetConvertible,
          transformed;

      beforeAll(function () {
        SetConvertible = $oop.createClass('test.$data.SetContainer.SetConvertible')
        .blend($data.DataContainer)
        .blend($data.SetConvertible)
        .build();
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
