//"use strict";
//
//var $assert = window['giant-assert'],
//    $data = window['giant-data'];
//
//describe("$data", function () {
//    var data,
//        store,
//        result;
//
//    describe("Lookup", function () {
//        beforeEach(function () {
//            data = {
//                foo: "FOO",
//                bar: "BAR"
//            };
//            store = $data.Lookup.create(data);
//        });
//
//        describe("setItem()", function () {
//            var value = {};
//
//            beforeEach(function () {
//                result = store.setItem('baz', value);
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(store);
//            });
//
//            it("should set value in store", function () {
//                expect(store._data.baz).toBe(value);
//            });
//        });
//
//        describe("deleteItem()", function () {
//            beforeEach(function () {
//                result = store.deleteItem('foo');
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(store);
//            });
//
//            it("should remove key", function () {
//                expect(store._data.hasOwnProperty('foo')).toBeFalsy();
//            });
//
//            describe("when specifying value", function () {
//                describe("when value doesn't match", function () {
//                    it("should not remove key", function () {
//                        store.deleteItem('bar', 'bar');
//                        expect(store._data).toEqual({
//                            bar: "BAR"
//                        });
//                    });
//                });
//            });
//        });
//
//        describe("getValue()", function () {
//            it("should return corresponding value", function () {
//                expect(store.getValue('foo')).toBe("FOO");
//            });
//        });
//
//        describe("getFirstKey()", function () {
//            beforeEach(function () {
//                result = store.getFirstKey();
//            });
//
//            it("should return one of the keys", function () {
//                expect(result === "foo" || result === "bar").toBeTruthy();
//            });
//        });
//
//        describe("getFirstValue()", function () {
//            beforeEach(function () {
//                result = store.getFirstValue();
//            });
//
//            it("should return one of the values", function () {
//                expect(result === "FOO" || result === "BAR").toBeTruthy();
//            });
//        });
//    });
//
//    describe("Container", function () {
//        describe("toLookup()", function () {
//            var buffer = $data.Container.create([1, 2, 3]);
//
//            beforeEach(function () {
//                result = buffer.toLookup();
//            });
//
//            it("should return a Lookup instance", function () {
//                expect($data.Lookup.isIncludedBy(result)).toBeTruthy();
//            });
//
//            it("should set data buffer", function () {
//                expect(result._data).toBe(buffer._data);
//            });
//        });
//    });
//});
//
//describe("Array", function () {
//    var result;
//
//    describe("toLookup()", function () {
//        var array = [1, 2, 3];
//
//        beforeEach(function () {
//            result = array.toLookup();
//        });
//
//        it("should return a Lookup instance", function () {
//            expect($data.Lookup.isIncludedBy(result)).toBeTruthy();
//        });
//
//        it("should set data buffer", function () {
//            expect(result._data).toBe(array);
//        });
//    });
//});
