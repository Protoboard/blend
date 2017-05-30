"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    beforeEach(function () {
        $oop.Class.classLookup = {};
    });

    describe("KeyValueContainer", function () {
        var data,
            KeyValueContainer,
            keyValueContainer,
            Settable,
            result;

        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: "BAR"
            };

            KeyValueContainer = $oop.getClass('KeyValueContainer')
                .extend($data.DataContainer)
                .extend($data.KeyValueContainer)
                .define({
                    setItem: function (key, value) {
                        this._data[key] = value;
                    },
                    forEachItem: function (callback, context) {
                        var data = this._data,
                            keys = Object.keys(this._data),
                            i, key;
                        for (i = 0; i < keys.length; i++) {
                            key = keys[i];
                            callback.call(context || this, data[key], key);
                        }
                    }
                });

            Settable = $oop.getClass('Settable')
                .extend($data.DataContainer)
                .define({
                    setItem: function (key, value) {
                        this._data[key] = value;
                    }
                });

            keyValueContainer = KeyValueContainer.create(data);
        });

        describe("getKeys()", function () {
            beforeEach(function () {
                result = keyValueContainer.getKeys();
            });

            it("should return array with keys", function () {
                expect(result.sort()).toEqual(['foo', 'bar'].sort());
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

        describe("toType()", function () {
            var KeyValueContainer;

            beforeEach(function () {
                KeyValueContainer = $oop.getClass('KeyValueContainer')
                    .extend($data.DataContainer)
                    .define({
                        init: function (data) {
                            this._data = data || [];
                        },

                        setItem: function (key, value) {
                            this._data.push([key, value]);
                        }
                    });

                result = keyValueContainer.toType(KeyValueContainer);
            });

            it("should return instance of specified class", function () {
                expect(KeyValueContainer.isIncludedBy(result)).toBeTruthy();
            });

            it("should set contents", function () {
                expect(result._data).toEqual([
                    ['foo', 'FOO'],
                    ['bar', 'BAR']
                ]);
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
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo'],
                    ['BAR', 'bar']
                ]);
            });

            it("should return mapped collection", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    foo: "_FOO",
                    bar: "_BAR"
                });
            });

            describe("for array set", function () {
                beforeEach(function () {
                    keyValueContainer = KeyValueContainer.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = keyValueContainer.mapValues(function (value) {
                        return value.toLowerCase();
                    });
                });

                it("should return array set", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("mapKeys()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy().and
                    .callFake(function (value) {
                        return value.toUpperCase();
                    });

                spyOn($data, 'getMapResultClass').and.returnValue(Settable);

                result = keyValueContainer.mapKeys(callback);
            });

            it("should return instance of correct class", function () {
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo'],
                    ['BAR', 'bar']
                ]);
            });

            it("should return mapped collection", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    FOO: "FOO",
                    BAR: "BAR"
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
                expect(result._data).toEqual({
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
                    expect(result._data).toEqual({
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
                expect(result._data).toEqual({
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
                    expect(String.prototype.toLowerCase.calls.allArgs())
                        .toEqual([
                            [],
                            []
                        ]);
                });

                it("should return mapped collection", function () {
                    expect(result._data).toEqual({
                        foo: 'foo',
                        bar: 'bar'
                    });
                });
            });
        });

        describe("createWithEachValue()", function () {
            var Class;

            beforeEach(function () {
                Class = $oop.getClass('Class')
                    .define({
                        init: function (arg1, arg2) {
                            this.arg1 = arg1;
                            this.arg2 = arg2;
                        }
                    });
                spyOn(Class, 'create').and.callThrough();
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                result = keyValueContainer.createWithEachValue(Class, 1, 'baz');
            });

            it("should pass values to constructor", function () {
                expect(Class.create.calls.allArgs()).toEqual([
                    ['baz', 'FOO'],
                    ['baz', 'BAR']
                ]);
            });

            it("should return mapped collection", function () {
                expect(result._data).toEqual({
                    foo: Class.create('baz', 'FOO'),
                    bar: Class.create('baz', 'BAR')
                });
            });

            describe("on no extra arguments", function () {
                var Class2;

                beforeEach(function () {
                    Class2 = $oop.getClass('Class2')
                        .define({
                            init: function (arg1) {
                                this.arg1 = arg1;
                            }
                        });
                    spyOn(Class2, 'create').and.callThrough();
                    result = keyValueContainer.createWithEachValue(Class2);
                });

                it("should pass values to constructor", function () {
                    expect(Class2.create.calls.allArgs()).toEqual([
                        ['FOO'],
                        ['BAR']
                    ]);
                });

                it("should return mapped collection", function () {
                    expect(result._data).toEqual({
                        foo: Class2.create('FOO'),
                        bar: Class2.create('BAR')
                    });
                });
            });
        });

        describe("filterBy()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy().and
                    .callFake(function (value) {
                        return value[0] === 'F';
                    });
                result = keyValueContainer.filterBy(callback);
            });

            it("should return instance of correct class", function () {
                expect(KeyValueContainer.isIncludedBy(result)).toBeTruthy();
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ["FOO", 'foo'],
                    ["BAR", 'bar']
                ]);
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    foo: "FOO"
                });
            });

            describe("for array set", function () {
                beforeEach(function () {
                    keyValueContainer = KeyValueContainer.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = keyValueContainer.filterBy(function (value) {
                        return value.length > 3;
                    });
                });

                it("should return array set", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByKeyPrefix()", function () {
            beforeEach(function () {
                result = keyValueContainer.filterByKeyPrefix('f');
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    foo: 'FOO'
                });
            });
        });

        describe("filterByPrefix()", function () {
            beforeEach(function () {
                result = keyValueContainer.filterByPrefix('F');
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    foo: 'FOO'
                });
            });
        });

        describe("filterByKeyRegExp()", function () {
            beforeEach(function () {
                result = keyValueContainer.filterByKeyRegExp(/o$/);
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    foo: 'FOO'
                });
            });
        });

        describe("filterByRegExp()", function () {
            beforeEach(function () {
                result = keyValueContainer.filterByRegExp(/^B/);
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(keyValueContainer);
                expect(result._data).toEqual({
                    bar: 'BAR'
                });
            });
        });

        describe("filterByType()", function () {
            var object = {},
                container = $data.DataContainer.create();

            beforeEach(function () {
                keyValueContainer = KeyValueContainer.create({
                    foo: "FOO",
                    baz: object,
                    quux: container
                });
            });

            describe("for string argument", function () {
                beforeEach(function () {
                    result = keyValueContainer.filterByType('string');
                });

                it("should retrieve typeof matches", function () {
                    expect(result._data).toEqual({
                        foo: "FOO"
                    });
                });
            });

            describe("for function argument", function () {
                beforeEach(function () {
                    result = keyValueContainer.filterByType(Object);
                });

                it("should retrieve instanceof matches", function () {
                    expect(result._data).toEqual({
                        baz: object,
                        quux: container
                    });
                });
            });

            describe("for object argument", function () {
                beforeEach(function () {
                    result = keyValueContainer.filterByType(Object.prototype);
                });

                it("should retrieve prototype matches", function () {
                    expect(result._data).toEqual({
                        baz: object,
                        quux: container
                    });
                });
            });

            describe("for Class argument", function () {
                beforeEach(function () {
                    result = keyValueContainer.filterByType($utils.Cloneable);
                });

                it("should retrieve Class inclusion matches", function () {
                    expect(result._data).toEqual({
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
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should swap keys and values", function () {
                expect(result._data).toEqual({
                    FOO: "foo",
                    BAR: "bar"
                });
            });
        });

        describe("mergeWith()", function () {
            var keyValueContainer2;

            beforeEach(function () {
                keyValueContainer2 = KeyValueContainer.create({
                    bar: "bar",
                    baz: "baz"
                });
                spyOn($data, 'getMergeResultClass').and.returnValue(Settable);
                result = keyValueContainer.mergeWith(keyValueContainer2);
            });

            it("should return instance of correct class", function () {
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should merge keys and values", function () {
                expect(result._data).toEqual({
                    foo: "FOO",
                    bar: "bar",
                    baz: "baz"
                });
            });
        });
    });
});
