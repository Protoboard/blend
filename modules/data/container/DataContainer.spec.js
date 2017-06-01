"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
    describe("DataContainer", function () {
        var data,
            container,
            result;

        beforeEach(function () {
            data = {};
            container = $data.DataContainer.create(data);
        });

        describe("create()", function () {
            it("should set _data property", function () {
                expect(container._data).toBe(data);
            });

            describe("on missing arguments", function () {
                beforeEach(function () {
                    container = $data.DataContainer.create();
                });

                it("should set _data property", function () {
                    expect(container._data).toEqual({});
                });
            });

            describe("on invalid arguments", function () {
                it("should throw", function () {
                    expect(function () {
                        $data.DataContainer.create("foo");
                    }).toThrow();
                });
            });
        });

        describe("clone()", function () {
            beforeEach(function () {
                result = container.clone();
            });

            it("should return cloned instance", function () {
                expect(result).not.toBe(container);
            });

            it("should set _data", function () {
                expect(result._data).toBe(container._data);
            });
        });

        describe("destroy()", function () {
            beforeEach(function () {
                spyOn(container, 'clear');
                result = container.destroy();
            });

            it("should return self", function () {
                expect(result).toBe(container);
            });

            it("should clear data", function () {
                expect(container.clear).toHaveBeenCalled();
            });
        });

        describe("clear()", function () {
            beforeEach(function () {
                result = container.clear();
            });

            it("should return self", function () {
                expect(result).toBe(container);
            });

            describe("of array data", function () {
                beforeEach(function () {
                    container = $data.DataContainer.create([1, 2, 3]);
                    container.clear();
                });

                it("should replace data with empty array", function () {
                    expect(container._data).toEqual([]);
                });
            });

            describe("of object data", function () {
                it("should replace data with empty object", function () {
                    expect(container._data).toEqual({});
                });
            });
        });

        describe("passDataTo()", function () {
            var callback,
                returnValue;

            beforeEach(function () {
                returnValue = {};
                callback = jasmine.createSpy().and.returnValue(returnValue);
                result = container.passDataTo(callback);
            });

            it("should pass data to callback", function () {
                expect(callback).toHaveBeenCalledWith(container._data);
            });

            it("should return return value of callback", function () {
                expect(result).toBe(returnValue);
            });
        });

        describe("passSelfTo()", function () {
            var callback,
                returnValue;

            beforeEach(function () {
                returnValue = {};
                callback = jasmine.createSpy().and.returnValue(returnValue);
                result = container.passSelfTo(callback);
            });

            it("should pass data to callback", function () {
                expect(callback).toHaveBeenCalledWith(container);
            });

            it("should return return value of callback", function () {
                expect(result).toBe(returnValue);
            });
        });
    });
});
