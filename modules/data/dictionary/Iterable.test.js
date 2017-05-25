"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    beforeEach(function () {
        $oop.Class.classLookup = {};
    });

    describe("Iterable", function () {
        var data,
            Iterable,
            iterable,
            Settable,
            result;

        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: "BAR"
            };

            Iterable = $oop.getClass('Iterable')
                .extend($data.Container)
                .include($data.Iterable)
                .define({
                    forEachItem: function (callback) {
                        var data = this._data,
                            keys = Object.keys(this._data),
                            i, key;
                        for (i = 0; i < keys.length; i++) {
                            key = keys[i];
                            callback(data[key], key, this);
                        }
                    }
                });

            Settable = $oop.getClass('Settable')
                .extend($data.Container)
                .define({
                    setItem: function (key, value) {
                        this._data[key] = value;
                    }
                });

            iterable = Iterable.create(data);
        });

        describe("create()", function () {
            it("should initialize _itemCount property", function () {
                expect(iterable.hasOwnProperty('_itemCount')).toBeTruthy();
                expect(iterable._itemCount).toBeUndefined();
            });

            describe("on missing arguments", function () {
                it("should set _itemCount property to 0", function () {
                    iterable = Iterable.create();
                    expect(iterable._itemCount).toBe(0);
                });
            });
        });

        describe("clone()", function () {
            var clonedIterable;

            beforeEach(function () {
                iterable._itemCount = 2;
                clonedIterable = iterable.clone();
            });

            it("should return cloned instance", function () {
                expect(clonedIterable).not.toBe(iterable);
            });

            it("should set _itemCount", function () {
                expect(clonedIterable._itemCount).toBe(2);
            });
        });

        describe("clear()", function () {
            beforeEach(function () {
                result = iterable.clear();
            });

            it("should return self", function () {
                expect(result).toBe(iterable);
            });

            it("should reset _itemCount", function () {
                expect(iterable._itemCount).toBe(0);
            });
        });

        describe("getItemCount()", function () {
            beforeEach(function () {
                result = iterable.getItemCount();
            });

            it("should return key count", function () {
                expect(result).toBe(2);
            });

            it("should set _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });
        });

        describe("getKeys()", function () {
            beforeEach(function () {
                result = iterable.getKeys();
            });

            it("should return array with keys", function () {
                expect(result.sort()).toEqual(['foo', 'bar'].sort());
            });

            it("should set _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });
        });

        describe("getValues()", function () {
            beforeEach(function () {
                result = iterable.getValues();
            });

            it("should retrieve array of values", function () {
                expect(result.sort()).toEqual(["FOO", "BAR"].sort());
            });

            it("should update _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });
        });

        describe("toType()", function () {
            var KeyValueContainer;

            beforeEach(function () {
                KeyValueContainer = $oop.getClass('KeyValueContainer')
                    .extend($data.Container)
                    .define({
                        init: function (data) {
                            this._data = data || [];
                        },

                        setItem: function (key, value) {
                            this._data.push([key, value]);
                        }
                    });

                result = iterable.toType(KeyValueContainer);
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

                result = iterable.mapValues(callback);
            });

            it("should return instance of correct class", function () {
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should update _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo', iterable],
                    ['BAR', 'bar', iterable]
                ]);
            });

            it("should return mapped collection", function () {
                expect(result).not.toBe(iterable);
                expect(result._data).toEqual({
                    foo: "_FOO",
                    bar: "_BAR"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    iterable = Iterable.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = iterable.mapValues(function (value) {
                        return value.toLowerCase();
                    });
                });

                it("should return array buffer", function () {
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

                result = iterable.mapKeys(callback);
            });

            it("should return instance of correct class", function () {
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should update _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo', iterable],
                    ['BAR', 'bar', iterable]
                ]);
            });

            it("should return mapped collection", function () {
                expect(result).not.toBe(iterable);
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
                result = iterable.reduce(callback, '');
            });

            it("should update _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['', 'FOO', 'foo', iterable],
                    ['FOO', 'BAR', 'bar', iterable]
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

                result = iterable.passEachValueTo(callback, null, 1, 'baz');
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
                    result = iterable.passEachValueTo(callback);
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
                result = iterable.callOnEachValue('split', '');
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
                    result = iterable.callOnEachValue('toLowerCase');
                });

                it("should pass arguments to method", function () {
                    expect(String.prototype.toLowerCase.calls.allArgs()).toEqual([
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
                result = iterable.createWithEachValue(Class, 1, 'baz');
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
                    result = iterable.createWithEachValue(Class2);
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
                    .callFake(function (value, key) {
                        return value[0] === 'F';
                    });
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                result = iterable.filterBy(callback);
            });

            it("should return instance of correct class", function () {
                expect(Settable.isIncludedBy(result)).toBeTruthy();
            });

            it("should update _itemCount", function () {
                expect(iterable._itemCount).toBe(2);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ["FOO", 'foo', iterable],
                    ["BAR", 'bar', iterable]
                ]);
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(iterable);
                expect(result._data).toEqual({
                    foo: "FOO"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    iterable = Iterable.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = iterable.filterBy(function (value) {
                        return value.length > 3;
                    });
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByKeyPrefix()", function () {
            beforeEach(function () {
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                result = iterable.filterByKeyPrefix('f');
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(iterable);
                expect(result._data).toEqual({
                    foo: 'FOO'
                });
            });
        });

        describe("filterByPrefix()", function () {
            beforeEach(function () {
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                result = iterable.filterByPrefix('F');
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(iterable);
                expect(result._data).toEqual({
                    foo: 'FOO'
                });
            });
        });

        describe("filterByKeyRegExp()", function () {
            beforeEach(function () {
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                result = iterable.filterByKeyRegExp(/o$/);
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(iterable);
                expect(result._data).toEqual({
                    foo: 'FOO'
                });
            });
        });

        describe("filterByRegExp()", function () {
            beforeEach(function () {
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                result = iterable.filterByRegExp(/^B/);
            });

            it("should return filtered iterable", function () {
                expect(result).not.toBe(iterable);
                expect(result._data).toEqual({
                    bar: 'BAR'
                });
            });
        });

        describe("filterByType()", function () {
            var object = {},
                container = $data.Container.create();

            beforeEach(function () {
                spyOn($data, 'getMapResultClass').and.returnValue(Settable);
                iterable = Iterable.create({
                    foo: "FOO",
                    baz: object,
                    quux: container
                });
            });

            describe("for string argument", function () {
                beforeEach(function () {
                    result = iterable.filterByType('string');
                });

                it("should retrieve typeof matches", function () {
                    expect(result._data).toEqual({
                        foo: "FOO"
                    });
                });
            });

            describe("for function argument", function () {
                beforeEach(function () {
                    result = iterable.filterByType(Object);
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
                    result = iterable.filterByType(Object.prototype);
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
                    result = iterable.filterByType($utils.Cloneable);
                });

                it("should retrieve Class inclusion matches", function () {
                    expect(result._data).toEqual({
                        quux: container
                    });
                });
            });
        });
    });
});
