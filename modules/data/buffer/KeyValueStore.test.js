"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        store,
        result;

    describe("KeyValueStore", function () {
        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: "BAR"
            };
            store = $data.KeyValueStore.create(data);
        });

        describe("create()", function () {
            it("should initialize _keyCount property", function () {
                expect(store.hasOwnProperty('_keyCount')).toBeTruthy();
                expect(store._keyCount).toBeUndefined();
            });

            describe("on missing arguments", function () {
                it("should set _keyCount property to 0", function () {
                    store = $data.KeyValueStore.create();
                    expect(store._keyCount).toBe(0);
                });
            });
        });

        describe("clone()", function () {
            var clonedBuffer;

            beforeEach(function () {
                store._keyCount = 2;
                clonedBuffer = store.clone();
            });

            it("should return cloned instance", function () {
                expect(clonedBuffer).not.toBe(store);
            });

            it("should set _keyCount", function () {
                expect(clonedBuffer._keyCount).toBe(2);
            });
        });

        describe("clear()", function () {
            beforeEach(function () {
                result = store.clear();
            });

            it("should return self", function () {
                expect(result).toBe(store);
            });

            it("should reset _keyCount", function () {
                expect(store._keyCount).toBe(0);
            });
        });

        describe("setItem()", function () {
            var value = {};

            beforeEach(function () {
                result = store.setItem('baz', value);
            });

            it("should return self", function () {
                expect(result).toBe(store);
            });

            it("should set value in store", function () {
                expect(store._data.baz).toBe(value);
            });
        });

        describe("setItems()", function () {
            var values = {
                bar: "bar",
                baz: "baz"
            };

            beforeEach(function () {
                result = store.setItems(values);
            });

            it("should return self", function () {
                expect(result).toBe(store);
            });

            it("should set value in store", function () {
                expect(store._data).toEqual({
                    foo: "FOO",
                    bar: "bar",
                    baz: "baz"
                });
            });
        });

        describe("getValue()", function () {
            it("should return corresponding value", function () {
                expect(store.getValue('foo')).toBe("FOO");
            });
        });

        describe("deleteItem()", function () {
            beforeEach(function () {
                result = store.deleteItem('foo');
            });

            it("should return self", function () {
                expect(result).toBe(store);
            });

            it("should remove key", function () {
                expect(store._data.hasOwnProperty('foo')).toBeFalsy();
            });

            describe("when specifying value", function () {
                describe("when value doesn't match", function () {
                    it("should not remove key", function () {
                        store.deleteItem('bar', 'bar');
                        expect(store._data).toEqual({
                            bar: "BAR"
                        });
                    });
                });
            });
        });

        describe("deleteItems()", function () {
            beforeEach(function () {
                result = store.deleteItems({
                    foo: 'bar',
                    bar: 'BAR'
                });
            });

            it("should remove matching items", function () {
                expect(store._data).toEqual({
                    foo: "FOO"
                });
            });
        });

        describe("getKeyCount()", function () {
            beforeEach(function () {
                result = store.getKeyCount();
            });

            it("should return key count", function () {
                expect(result).toBe(2);
            });

            it("should set _keyCount", function () {
                expect(store._keyCount).toBe(2);
            });

            describe("then setItem()", function () {
                beforeEach(function () {
                    result = store.setItem('baz', "BAZ");
                });

                it("should increase _keyCount", function () {
                    expect(store._keyCount).toBe(3);
                });

                describe("when setting existing key", function () {
                    beforeEach(function () {
                        store.setItem('baz', "BAZ");
                    });

                    it("should not increase key count", function () {
                        expect(store._keyCount).toBe(3);
                    });
                });
            });

            describe("then setItems()", function () {
                beforeEach(function () {
                    result = store.setItems({
                        bar: "bar",
                        baz: "baz"
                    });
                });

                it("should increase _keyCount", function () {
                    expect(store._keyCount).toBe(3);
                });
            });

            describe("then deleteItem()", function () {
                beforeEach(function () {
                    result = store.deleteItem('foo');
                });

                it("should update _keyCount", function () {
                    expect(store._keyCount).toBe(1);
                });

                describe("when deleting absent key", function () {
                    beforeEach(function () {
                        result = store.deleteItem('foo');
                    });

                    it("should not change _keyCount", function () {
                        expect(store._keyCount).toBe(1);
                    });
                });
            });
        });

        describe("getKeys()", function () {
            beforeEach(function () {
                result = store.getKeys();
            });

            it("should return array with keys", function () {
                expect(result.sort()).toEqual(['foo', 'bar'].sort());
            });

            it("should set _keyCount", function () {
                expect(store._keyCount).toBe(2);
            });
        });

        describe("getValues()", function () {
            beforeEach(function () {
                result = store.getValues();
            });

            it("should retrieve array of values", function () {
                expect(result.sort()).toEqual(["FOO", "BAR"].sort());
            });

            it("should update _keyCount", function () {
                expect(store._keyCount).toBe(2);
            });
        });

        describe("getFirstKey()", function () {
            beforeEach(function () {
                result = store.getFirstKey();
            });

            it("should return one of the keys", function () {
                expect(result === "foo" || result === "bar").toBeTruthy();
            });
        });

        describe("getFirstValue()", function () {
            beforeEach(function () {
                result = store.getFirstValue();
            });

            it("should return one of the keys", function () {
                expect(result === "FOO" || result === "BAR").toBeTruthy();
            });
        });
    });

    describe("Buffer", function () {
        describe("toKeyValueStore()", function () {
            var buffer = $data.Buffer.create([1, 2, 3]);

            beforeEach(function () {
                result = buffer.toKeyValueStore();
            });

            it("should return a KeyValueStore instance", function () {
                expect($data.KeyValueStore.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(buffer._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toKeyValueStore()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toKeyValueStore();
        });

        it("should return a KeyValueStore instance", function () {
            expect($data.KeyValueStore.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});
