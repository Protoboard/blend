"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("KeyValueContainer", function () {
    var data,
        KeyValueContainer,
        keyValueContainer,
        Settable,
        result;

    beforeAll(function () {
      KeyValueContainer = $oop.createClass('test.$data.KeyValueContainer.KeyValueContainer')
      .blend($data.DataContainer)
      .blend($data.ObjectContainer)
      .blend($data.KeyValueContainer)
      .define({
        setItem: function (key, value) {
          this.data[key] = value;
        },
        forEachItem: function (callback, context) {
          callback = context ? callback.bind(context) : callback;
          var data = this.data;
          Object.keys(this.data).forEach(function (key) {
            callback(data[key], key);
          });
        }
      })
      .build();

      Settable = $oop.createClass('test.$data.KeyValueContainer.Settable')
      .blend($data.DataContainer)
      .blend($data.ObjectContainer)
      .define({
        setItem: function (key, value) {
          this.data[key] = value;
        }
      })
      .build();
    });

    beforeEach(function () {
      data = {
        foo: "FOO",
        bar: "BAR"
      };

      keyValueContainer = KeyValueContainer.create({data: data});
    });

    describe("fromKeyValueContainer()", function () {
      var KeyValueContainer2,
          keyValueContainer2;

      beforeAll(function () {
        KeyValueContainer2 = $oop.createClass('test.$data.KeyValueContainer.KeyValueContainer2')
        .blend($data.DataContainer)
        .blend($data.ArrayContainer)
        .blend($data.KeyValueContainer)
        .define({
          setItem: function (key, value) {
            this.data.push([key, value]);
          },
          forEachItem: function (callback, context) {
            callback = context ? callback.bind(context) : callback;
            this.data.forEach(function (pair) {
              callback(pair[1], pair[0]);
            });
          }
        })
        .build();
      });

      beforeEach(function () {
        keyValueContainer2 = KeyValueContainer2.fromData([
          [1, "foo"],
          [2, "bar"]
        ]);

        result = KeyValueContainer.fromKeyValueContainer(keyValueContainer2);
      });

      it("should return KeyValueContainer instance", function () {
        expect(KeyValueContainer.mixedBy(result)).toBeTruthy();
      });

      it("should transfer data", function () {
        expect(result.data).toEqual({
          1: "foo",
          2: "bar"
        });
      });

      it("should pass additional properties to create", function () {
        result = KeyValueContainer.fromKeyValueContainer(keyValueContainer2, {bar: 'baz'});
        expect(result.bar).toBe('baz');
      });
    });

    describe("fromSetContainer()", function () {
      var SetContainer,
          setContainer;

      beforeAll(function () {
        SetContainer = $oop.createClass('test.$data.KeyValueContainer.SetContainer')
        .blend($data.DataContainer)
        .blend($data.ArrayContainer)
        .blend($data.SetContainer)
        .define({
          setItem: function (item) {
            this.data.push(item);
          },
          forEachItem: function (callback, context) {
            callback = context ? callback.bind(context) : callback;
            this.data.forEach(callback);
          }
        })
        .build();
      });

      beforeEach(function () {
        setContainer = SetContainer.fromData([1, 2, 3, 4]);

        result = KeyValueContainer.fromSetContainer(setContainer);
      });

      it("should return KeyValueContainer instance", function () {
        expect(KeyValueContainer.mixedBy(result)).toBeTruthy();
      });

      it("should transfer data", function () {
        expect(result.data).toEqual({
          1: 1,
          2: 2,
          3: 3,
          4: 4
        });
      });

      it("should pass additional properties to create", function () {
        result = KeyValueContainer.fromSetContainer(setContainer, {bar: 'baz'});
        expect(result.bar).toBe('baz');
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = keyValueContainer.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(keyValueContainer);
      });

      it("should set data", function () {
        expect(result.data).not.toBe(keyValueContainer.data);
        expect(result.data).toEqual(keyValueContainer.data);
      });
    });

    describe("filter()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (value) {
          return value[0] === 'F';
        });
        result = keyValueContainer.filter(callback);
      });

      it("should return instance of correct class", function () {
        expect(KeyValueContainer.mixedBy(result)).toBeTruthy();
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ["FOO", 'foo'],
          ["BAR", 'bar']
        ]);
      });

      it("should return filtered collection", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          foo: "FOO"
        });
      });

      describe("for array set", function () {
        beforeEach(function () {
          keyValueContainer = KeyValueContainer.create({
            data: ['foo', 'bar', 'baz', 'quux']
          });
          result = keyValueContainer.filter(function (value) {
            return value.length > 3;
          });
        });

        it("should return array set", function () {
          expect(result.data instanceof Array).toBeTruthy();
        });
      });
    });

    describe("reduce()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and.callFake(
            function (reduced, value) {
              return reduced + value;
            });
        result = keyValueContainer.reduce(callback, '');
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['', 'FOO', 'foo'],
          ['FOO', 'BAR', 'bar']
        ]);
      });

      it("should return reduced value", function () {
        expect(result).toBe("FOOBAR");
      });
    });

    describe("to()", function () {
      var KeyValueConvertible,
          transformed;

      beforeAll(function () {
        KeyValueConvertible = $oop.createClass('test.$data.KeyValueContainer.KeyValueConvertible')
        .blend($data.DataContainer)
        .blend($data.KeyValueConvertible)
        .build();
      });

      beforeEach(function () {
        transformed = {};

        spyOn(KeyValueConvertible, 'fromKeyValueContainer').and
        .returnValue(transformed);

        result = keyValueContainer.to(KeyValueConvertible);
      });

      it("should invoke fromKeyValueContainer() on target class", function () {
        expect(KeyValueConvertible.fromKeyValueContainer)
        .toHaveBeenCalledWith(keyValueContainer);
      });

      it("should return conversion result", function () {
        expect(result).toBe(transformed);
      });
    });

    describe("getKeys()", function () {
      beforeEach(function () {
        result = keyValueContainer.getKeys();
      });

      it("should return array with keys", function () {
        expect(result.sort()).toEqual(['foo', 'bar'].sort());
      });
    });

    describe("getKeysWrapped()", function () {
      var data;

      beforeEach(function () {
        data = [];
        spyOn(keyValueContainer, 'getKeys').and.returnValue(data);
        result = keyValueContainer.getKeysWrapped();
      });

      it("should return StringCollection instance", function () {
        expect($data.StringCollection.mixedBy(result)).toBeTruthy();
      });

      it("should invoke getKeys()", function () {
        expect(keyValueContainer.getKeys).toHaveBeenCalled();
      });

      it("should wrap result of getKeys()", function () {
        expect(result.data).toBe(data);
      });
    });

    describe("getValues()", function () {
      beforeEach(function () {
        result = keyValueContainer.getValues();
      });

      it("should retrieve array of values", function () {
        expect(result.sort()).toEqual(["FOO", "BAR"].sort());
      });
    });

    describe("getValuesWrapped()", function () {
      var data;

      beforeEach(function () {
        data = [];
        spyOn(keyValueContainer, 'getValues').and.returnValue(data);
        result = keyValueContainer.getValuesWrapped();
      });

      it("should return Collection instance", function () {
        expect($data.Collection.mixedBy(result)).toBeTruthy();
      });

      it("should invoke getValues()", function () {
        expect(keyValueContainer.getValues).toHaveBeenCalled();
      });

      it("should wrap result of getValues()", function () {
        expect(result.data).toBe(data);
      });
    });

    describe("getFirstKey()", function () {
      beforeEach(function () {
        result = keyValueContainer.getFirstKey();
      });

      it("should return one of the keys", function () {
        expect(result === "foo" || result === "bar").toBeTruthy();
      });
    });

    describe("getFirstValue()", function () {
      beforeEach(function () {
        result = keyValueContainer.getFirstValue();
      });

      it("should return one of the values", function () {
        expect(result === "FOO" || result === "BAR").toBeTruthy();
      });
    });

    describe("mapValues()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (value) {
          return '_' + value;
        });

        spyOn($data, 'getMapResultClass').and.returnValue(Settable);

        result = keyValueContainer.mapValues(callback);
      });

      it("should return instance of correct class", function () {
        expect(Settable.mixedBy(result)).toBeTruthy();
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['FOO', 'foo'],
          ['BAR', 'bar']
        ]);
      });

      it("should return mapped collection", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          foo: "_FOO",
          bar: "_BAR"
        });
      });

      describe("for array set", function () {
        beforeEach(function () {
          keyValueContainer = KeyValueContainer.create({
            data: ['foo', 'bar', 'baz', 'quux']
          });
          result = keyValueContainer.mapValues(function (value) {
            return value.toLowerCase();
          });
        });

        it("should return array set", function () {
          expect(result.data instanceof Array).toBeTruthy();
        });
      });
    });

    describe("mapKeys()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (value, key) {
          return '_' + key;
        });

        spyOn($data, 'getMapResultClass').and.returnValue(Settable);

        result = keyValueContainer.mapKeys(callback);
      });

      it("should return instance of correct class", function () {
        expect(Settable.mixedBy(result)).toBeTruthy();
      });

      it("should pass item values & keys to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['FOO', 'foo'],
          ['BAR', 'bar']
        ]);
      });

      it("should return mapped collection", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          _foo: "FOO",
          _bar: "BAR"
        });
      });
    });

    describe("passEachValueTo()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy().and
        .callFake(function (foo, value) {
          return value.toLowerCase();
        });

        spyOn($data, 'getMapResultClass').and.returnValue(Settable);

        result = keyValueContainer.passEachValueTo(callback, null, 1, 'baz');
      });

      it("should pass arguments to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['baz', 'FOO'],
          ['baz', 'BAR']
        ]);
      });

      it("should return mapped collection", function () {
        expect(result.data).toEqual({
          foo: "foo",
          bar: "bar"
        });
      });

      describe("on no extra arguments", function () {
        beforeEach(function () {
          callback = jasmine.createSpy().and
          .callFake(function (value) {
            return value.toLowerCase();
          });
          result = keyValueContainer.passEachValueTo(callback);
        });

        it("should pass values to callback", function () {
          expect(callback.calls.allArgs()).toEqual([
            ['FOO'],
            ['BAR']
          ]);
        });

        it("should return mapped collection", function () {
          expect(result.data).toEqual({
            foo: "foo",
            bar: "bar"
          });
        });
      });
    });

    describe("callOnEachValue()", function () {
      beforeEach(function () {
        spyOn(String.prototype, 'split').and.callThrough();
        spyOn($data, 'getMapResultClass').and.returnValue(Settable);
        result = keyValueContainer.callOnEachValue('split', '');
      });

      it("should pass arguments to method", function () {
        expect(String.prototype.split.calls.allArgs()).toEqual([
          [''],
          ['']
        ]);
      });

      it("should return mapped collection", function () {
        expect(result.data).toEqual({
          foo: ['F', 'O', 'O'],
          bar: ['B', 'A', 'R']
        });
      });

      describe("on no extra arguments", function () {
        beforeEach(function () {
          spyOn(String.prototype, 'toLowerCase').and.callThrough();
          result = keyValueContainer.callOnEachValue('toLowerCase');
        });

        it("should pass arguments to method", function () {
          expect(String.prototype.toLowerCase.calls.allArgs()).toEqual([
            [],
            []
          ]);
        });

        it("should return mapped collection", function () {
          expect(result.data).toEqual({
            foo: 'foo',
            bar: 'bar'
          });
        });
      });
    });

    describe("filterByKeyPrefix()", function () {
      beforeEach(function () {
        result = keyValueContainer.filterByKeyPrefix('f');
      });

      it("should return filtered container", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          foo: 'FOO'
        });
      });
    });

    describe("filterByValuePrefix()", function () {
      beforeEach(function () {
        result = keyValueContainer.filterByValuePrefix('F');
      });

      it("should return filtered container", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          foo: 'FOO'
        });
      });
    });

    describe("filterByKeyRegExp()", function () {
      beforeEach(function () {
        result = keyValueContainer.filterByKeyRegExp(/o$/);
      });

      it("should return filtered container", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          foo: 'FOO'
        });
      });
    });

    describe("filterByValueRegExp()", function () {
      beforeEach(function () {
        result = keyValueContainer.filterByValueRegExp(/^B/);
      });

      it("should return filtered container", function () {
        expect(result).not.toBe(keyValueContainer);
        expect(result.data).toEqual({
          bar: 'BAR'
        });
      });
    });

    describe("filterByValueType()", function () {
      var object = {},
          container = $data.DataContainer.create();

      beforeEach(function () {
        keyValueContainer = KeyValueContainer.create({
          data: {
            foo: "FOO",
            baz: object,
            quux: container
          }
        });
      });

      describe("for string argument", function () {
        beforeEach(function () {
          result = keyValueContainer.filterByValueType('string');
        });

        it("should retrieve typeof matches", function () {
          expect(result.data).toEqual({
            foo: "FOO"
          });
        });
      });

      describe("for function argument", function () {
        beforeEach(function () {
          result = keyValueContainer.filterByValueType(Object);
        });

        it("should retrieve instanceof matches", function () {
          expect(result.data).toEqual({
            baz: object,
            quux: container
          });
        });
      });

      describe("for object argument", function () {
        beforeEach(function () {
          result = keyValueContainer.filterByValueType(Object.prototype);
        });

        it("should retrieve prototype matches", function () {
          expect(result.data).toEqual({
            baz: object,
            quux: container
          });
        });
      });

      describe("for Class argument", function () {
        beforeEach(function () {
          result = keyValueContainer.filterByValueType($utils.Cloneable);
        });

        it("should retrieve Class inclusion matches", function () {
          expect(result.data).toEqual({
            quux: container
          });
        });
      });
    });

    describe("swapKeysAndValues()", function () {
      beforeEach(function () {
        spyOn($data, 'getSwapResultClass').and.returnValue(Settable);
        result = keyValueContainer.swapKeysAndValues();
      });

      it("should return instance of correct class", function () {
        expect(Settable.mixedBy(result)).toBeTruthy();
      });

      it("should swap keys and values", function () {
        expect(result.data).toEqual({
          FOO: "foo",
          BAR: "bar"
        });
      });
    });

    describe("mergeWith()", function () {
      var keyValueContainer2;

      beforeEach(function () {
        keyValueContainer2 = KeyValueContainer.create({
          data: {
            bar: "bar",
            baz: "baz"
          }
        });
        spyOn($data, 'getMergeResultClass').and.returnValue(Settable);
        result = keyValueContainer.mergeWith(keyValueContainer2);
      });

      it("should return instance of correct class", function () {
        expect(Settable.mixedBy(result)).toBeTruthy();
      });

      it("should merge keys and values", function () {
        expect(result.data).toEqual({
          foo: "FOO",
          bar: "bar",
          baz: "baz"
        });
      });
    });
  });
});
