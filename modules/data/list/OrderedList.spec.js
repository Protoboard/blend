"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        OrderedList,
        orderedList,
        result;

    describe("OrderedList", function () {
        var comparer;

        beforeEach(function () {
            data = ['bar', 'foo'];
            comparer = function (a, b) {
                return a > b ? 1 : a < b ? -1 : 0;
            };
            OrderedList = $oop.getClass("OrderedList")
                .extend($data.OrderedList);
            orderedList = OrderedList.create(data, comparer);
        });

        describe("create()", function () {
            it("should set data buffer", function () {
                expect(orderedList._data).toBe(data);
            });

            it("should set comparer", function () {
                expect(orderedList._comparer).toBe(comparer);
            });

            describe("on missing arguments", function () {
                beforeEach(function () {
                    orderedList = OrderedList.create();
                });

                it("should set default properties", function () {
                    expect(orderedList._data).toEqual([]);
                    expect(orderedList._comparer)
                        .toBe(orderedList._defaultComparer);
                });
            });

            describe("on invalid arguments", function () {
                it("should throw", function () {
                    expect(function () {
                        OrderedList.create('foo');
                    }).toThrow();
                    expect(function () {
                        OrderedList.create([], 'foo');
                    }).toThrow();
                });
            });
        });

        describe("clone()", function () {
            beforeEach(function () {
                result = orderedList.clone();
            });

            it("should set _comparer property", function () {
                expect(result._comparer).toBe(orderedList._comparer);
            });
        });

        describe("setItem()", function () {
            beforeEach(function () {
                result = orderedList.setItem('baz');
            });

            it("should return self", function () {
                expect(result).toBe(orderedList);
            });

            it("should splice item into list", function () {
                expect(orderedList._data).toEqual([
                    'bar', 'baz', 'foo'
                ]);
            });

            it("should update _itemCount", function () {
                expect(orderedList._itemCount).toBe(3);
            });

            describe("on lower-than-first item", function () {
                beforeEach(function () {
                    result = orderedList.setItem('abc');
                });

                it("should splice item in at start", function () {
                    expect(orderedList._data).toEqual([
                        'abc', 'bar', 'baz', 'foo'
                    ]);
                });
            });

            describe("on higher-than-last item", function () {
                beforeEach(function () {
                    result = orderedList.setItem('quux');
                });

                it("should splice item in at end", function () {
                    expect(orderedList._data).toEqual([
                        'bar', 'baz', 'foo', 'quux'
                    ]);
                });
            });

            describe("on duplicate", function () {
                beforeEach(function () {
                    result = orderedList.setItem('baz');
                });

                it("should splice item into list", function () {
                    expect(orderedList._data).toEqual([
                        'bar', 'baz', 'baz', 'foo'
                    ]);
                });
            });
        });

        describe("deleteItem()", function () {
            beforeEach(function () {
                result = orderedList.deleteItem('bar');
            });

            it("should return self", function () {
                expect(result).toBe(orderedList);
            });

            it("should remove item from buffer", function () {
                expect(orderedList._data).toEqual([
                    'foo'
                ]);
            });

            it("should update _itemCount", function () {
                expect(orderedList._itemCount).toBe(1);
            });

            describe("on absent item", function () {
                beforeEach(function () {
                    result = orderedList.deleteItem('bar');
                });

                it("should not change buffer", function () {
                    expect(orderedList._data).toEqual([
                        'foo'
                    ]);
                });

                it("should not change _itemCount", function () {
                    expect(orderedList._itemCount).toBe(1);
                });
            });
        });

        describe("hasItem()", function () {
            describe("for existing item", function () {
                it("should return true", function () {
                    expect(orderedList.hasItem('foo')).toBeTruthy();
                });
            });
            describe("for absent item", function () {
                it("should return false", function () {
                    expect(orderedList.hasItem('baz')).toBeFalsy();
                });
            });
        });

        describe("forEachItem()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy();
                result = orderedList.forEachItem(callback);
            });

            it("should return self", function () {
                expect(result).toBe(orderedList);
            });

            it("should pass items to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['bar'],
                    ['foo']
                ]);
            });

            describe("when interrupted", function () {
                beforeEach(function () {
                    callback = jasmine.createSpy().and.returnValue(false);
                    orderedList.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe("getRange()", function () {
            beforeEach(function () {
                orderedList
                    .setItem('baz')
                    .setItem('quux')
                    .setItem('hello')
                    .setItem('world')
                    .setItem('lorem')
                    .setItem('ipsum');

                result = orderedList.getRange('foo', 'lorem');
            });

            it("should return array", function () {
                expect(result instanceof Array).toBeTruthy();
            });

            it("should return specified range", function () {
                expect(result).toEqual([
                    'foo', 'hello', 'ipsum'
                ]);
            });

            describe("on absent bounds", function () {
                it("should return included range", function () {
                    expect(orderedList.getRange('far', 'lorus')).toEqual([
                        'foo', 'hello', 'ipsum', 'lorem'
                    ]);
                });
            });

            describe("on repeating items", function () {
                beforeEach(function () {
                    orderedList.setItem('foo');
                });

                it("should return repeated items in range", function () {
                    expect(orderedList.getRange('foo', 'foo_')).toEqual([
                        'foo', 'foo'
                    ]);
                });
            });

            describe("when offset & limit is specified", function () {
                it("should filter result by offset & limit", function () {
                    expect(orderedList.getRange('bar', 'lorem', 2)).toEqual([
                        'foo', 'hello', 'ipsum'
                    ]);
                    expect(orderedList.getRange('bar', 'lorem', 2, 2)).toEqual([
                        'foo', 'hello'
                    ]);
                });
            });
        });
    });

    describe("DataContainer", function () {
        describe("toOrderedList()", function () {
            var buffer = $data.DataContainer.create([1, 2, 3]);

            beforeEach(function () {
                result = buffer.toOrderedList();
            });

            it("should return a OrderedList instance", function () {
                expect($data.OrderedList.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data set", function () {
                expect(result._data).toBe(buffer._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toOrderedList()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toOrderedList();
        });

        it("should return a OrderedList instance", function () {
            expect($data.OrderedList.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data set", function () {
            expect(result._data).toBe(array);
        });
    });
});
