"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        Collection,
        collection,
        result;

    describe("Collection", function () {
        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: "BAR"
            };
            Collection = $oop.getClass("Collection")
                .extend($data.Collection);
            collection = Collection.create(data);
        });

        describe("mergeWith()", function () {
            var collection2;

            beforeEach(function () {
                collection2 = $data.Collection.create({
                    bar: "bar",
                    baz: "BAZ"
                });
                result = collection.mergeWith(collection2);
            });

            it("should return new Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
                expect(result).not.toBe(collection);
                expect(result).not.toBe(collection2);
            });

            it("should append buffer", function () {
                expect(result._data).not.toBe(collection._data);
                expect(result._data).not.toBe(collection2._data);
                expect(result._data).toEqual({
                    foo: "FOO",
                    bar: "bar",
                    baz: "BAZ"
                });
            });
        });

        describe("mergeIn()", function () {
            var collection2;

            beforeEach(function () {
                collection2 = $data.Collection.create({
                    bar: "bar",
                    baz: "BAZ"
                });
                result = collection.mergeIn(collection2);
            });

            it("should return self", function () {
                expect(result).toBe(collection);
            });

            it("should append buffer", function () {
                expect(result._data).toEqual({
                    foo: "FOO",
                    bar: "bar",
                    baz: "BAZ"
                });
            });
        });

        describe("filterByKeys()", function () {
            beforeEach(function () {
                result = collection.filterByKeys(['foo', 'baz']);
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    foo: "FOO"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create(['foo', 'bar', 'baz']);
                    result = collection.filterByKeys([1, 5]);
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByKeyPrefix()", function () {
            beforeEach(function () {
                collection
                    .setItems({
                        baz: "BAZ",
                        quux: "QUUX"
                    });
                result = collection.filterByKeyPrefix('b');
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    bar: "BAR",
                    baz: "BAZ"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux',
                        'foo', 'bar', 'baz', 'quux',
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterByKeyPrefix('1');
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByPrefix()", function () {
            beforeEach(function () {
                collection
                    .setItems({
                        baz: "BAZ",
                        quux: "QUUX"
                    });
                result = collection.filterByPrefix('B');
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    bar: "BAR",
                    baz: "BAZ"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterByPrefix('ba');
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByKeyRegExp()", function () {
            beforeEach(function () {
                collection
                    .setItems({
                        baz: "BAZ",
                        quux: "QUUX"
                    });
                result = collection.filterByKeyRegExp(/(foo|qu\w+)/);
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    foo: "FOO",
                    quux: "QUUX"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux',
                        'foo', 'bar', 'baz', 'quux',
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterByKeyRegExp(/1\d*/);
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByRegExp()", function () {
            beforeEach(function () {
                collection
                    .setItems({
                        baz: "BAZ",
                        quux: "QUUX"
                    });
                result = collection.filterByRegExp(/(FOO|B\w+)/);
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    foo: "FOO",
                    bar: "BAR",
                    baz: "BAZ"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterByRegExp(/$ba/);
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByRegExp()", function () {
            beforeEach(function () {
                collection
                    .setItems({
                        baz: "BAZ",
                        quux: "QUUX"
                    });
                result = collection.filterByRegExp(/(FOO|B\w+)/);
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    foo: "FOO",
                    bar: "BAR",
                    baz: "BAZ"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterByRegExp(/$ba/);
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterByType()", function () {
            var object = {},
                buffer = $data.Buffer.create();

            beforeEach(function () {
                collection
                    .setItems({
                        baz: object,
                        quux: buffer
                    });
                result = collection.filterByType('string');
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            describe("for string argument", function () {
                beforeEach(function () {
                    result = collection.filterByType('string');
                });

                it("should retrieve typeof matches", function () {
                    expect(result._data).toEqual({
                        foo: "FOO",
                        bar: "BAR"
                    });
                });
            });

            describe("for function argument", function () {
                beforeEach(function () {
                    result = collection.filterByType(Object);
                });

                it("should retrieve instanceof matches", function () {
                    expect(result._data).toEqual({
                        baz: object,
                        quux: buffer
                    });
                });
            });

            describe("for object argument", function () {
                beforeEach(function () {
                    result = collection.filterByType(Object.prototype);
                });

                it("should retrieve prototype matches", function () {
                    expect(result._data).toEqual({
                        baz: object,
                        quux: buffer
                    });
                });
            });

            describe("for Class argument", function () {
                beforeEach(function () {
                    result = collection.filterByType($utils.Cloneable);
                });

                it("should retrieve Class inclusion matches", function () {
                    expect(result._data).toEqual({
                        quux: buffer
                    });
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterByType('string');
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("filterBy()", function () {
            var context,
                callback;

            beforeEach(function () {
                context = {};
                callback = jasmine.createSpy().and.callFake(function (value, key) {
                    return value !== key.toUpperCase();
                });
                collection
                    .setItems({
                        baz: "BAZ",
                        quux: "Hello World!"
                    });
                result = collection.filterBy(callback, context);
            });

            it("should return Collection instance", function () {
                expect(Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ["FOO", 'foo', collection],
                    ["BAR", 'bar', collection],
                    ["BAZ", 'baz', collection],
                    ["Hello World!", 'quux', collection]
                ]);
            });

            it("should return filtered collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    quux: "Hello World!"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.filterBy(function (value) {
                        return value.length > 3;
                    });
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("forEachItem()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy();
                result = collection.forEachItem(callback);
            });

            it("should return self", function () {
                expect(result).toBe(collection);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo', collection],
                    ['BAR', 'bar', collection]
                ]);
            });

            describe("when interrupted", function () {
                beforeEach(function () {
                    callback = jasmine.createSpy().and.returnValue(false);
                    collection.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback.calls.allArgs()).toEqual([
                        ['FOO', 'foo', collection]
                    ]);
                });
            });
        });

        describe("mapValues()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy().and.callFake(function (value) {
                    return value.toLowerCase();
                });
                result = collection.mapValues(callback);
            });

            it("should return Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo', collection],
                    ['BAR', 'bar', collection]
                ]);
            });

            it("should return mapped collection", function () {
                expect(result).not.toBe(collection);
                expect(result._data).toEqual({
                    foo: "foo",
                    bar: "bar"
                });
            });

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.mapValues(function (value) {
                        return value.toLowerCase();
                    });
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
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
                result = collection.reduce(callback, '');
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['', 'FOO', 'foo', collection],
                    ['FOO', 'BAR', 'bar', collection]
                ]);
            });

            it("should return reduced value", function () {
                expect(result).toBe("FOOBAR");
            });
        });

        describe("passEachValueTo()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy().and.callFake(function (foo, value) {
                    return value.toLowerCase();
                });
                result = collection.passEachValueTo(callback, null, 1, 'baz');
            });

            it("should return Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
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
                    callback = jasmine.createSpy().and.callFake(function (value) {
                        return value.toLowerCase();
                    });
                    result = collection.passEachValueTo(callback);
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

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.passEachValueTo(function (value) {
                        return value.toLowerCase();
                    });
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });

        describe("callOnEachValue()", function () {
            beforeEach(function () {
                spyOn(String.prototype, 'split').and.callThrough();
                result = collection.callOnEachValue('split', '');
            });

            it("should return Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
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
                    result = collection.callOnEachValue('toLowerCase');
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
                result = collection.createWithEachValue(Class, 1, 'baz');
            });

            it("should return Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should pass arguments to callback", function () {
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
                    result = collection.createWithEachValue(Class2);
                });

                it("should pass values to callback", function () {
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

            describe("for array buffer", function () {
                beforeEach(function () {
                    collection = $data.Collection.create([
                        'foo', 'bar', 'baz', 'quux'
                    ]);
                    result = collection.createWithEachValue(Class);
                });

                it("should return array buffer", function () {
                    expect(result._data instanceof Array).toBeTruthy();
                });
            });
        });
    });

    describe("Buffer", function () {
        describe("toCollection()", function () {
            var buffer = $data.Buffer.create([1, 2, 3]);

            beforeEach(function () {
                result = buffer.toCollection();
            });

            it("should return a Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(buffer._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toCollection()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toCollection();
        });

        it("should return a Collection instance", function () {
            expect($data.Collection.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});
