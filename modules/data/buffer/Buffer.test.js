"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
    describe("Buffer", function () {
        var data,
            buffer,
            result;

        beforeEach(function () {
            data = {};
            buffer = $data.Buffer.create(data);
        });

        describe("create()", function () {
            it("should set _data property", function () {
                expect(buffer._data).toBe(data);
            });

            describe("on missing arguments", function () {
                beforeEach(function () {
                    buffer = $data.Buffer.create();
                });

                it("should set _data property", function () {
                    expect(buffer._data).toEqual({});
                });
            });

            describe("on invalid arguments", function () {
                it("should throw", function () {
                    expect(function () {
                        $data.Buffer.create("foo");
                    }).toThrow();
                });
            });
        });

        describe("clone()", function () {
            var clonedData,
                clonedBuffer;

            beforeEach(function () {
                clonedData = {foo: "FOO", bar: "BAR"};
                spyOn($data, 'shallowCopy').and.returnValue(clonedData);
                clonedBuffer = buffer.clone();
            });

            it("should return cloned instance", function () {
                expect(clonedBuffer).not.toBe(buffer);
            });

            it("should set _data", function () {
                expect($data.shallowCopy).toHaveBeenCalledWith(buffer._data);
                expect(clonedBuffer._data).toBe(clonedData);
            });
        });

        describe("destroy()", function () {
            beforeEach(function () {
                spyOn(buffer, 'clear');
                result = buffer.destroy();
            });

            it("should return self", function () {
                expect(result).toBe(buffer);
            });

            it("should clear data", function () {
                expect(buffer.clear).toHaveBeenCalled();
            });
        });

        describe("clear()", function () {
            beforeEach(function () {
                result = buffer.clear();
            });

            it("should return self", function () {
                expect(result).toBe(buffer);
            });

            describe("of array data", function () {
                beforeEach(function () {
                    buffer = $data.Buffer.create([1, 2, 3]);
                    buffer.clear();
                });

                it("should replace data with empty array", function () {
                    expect(buffer._data).toEqual([]);
                });
            });

            describe("of object data", function () {
                it("should replace data with empty object", function () {
                    expect(buffer._data).toEqual({});
                });
            });
        });

        describe("passDataTo()", function () {
            var callback,
                returnValue;

            beforeEach(function () {
                returnValue = {};
                callback = jasmine.createSpy().and.returnValue(returnValue);
                result = buffer.passDataTo(callback);
            });

            it("should pass data to callback", function () {
                expect(callback).toHaveBeenCalledWith(buffer._data);
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
                result = buffer.passSelfTo(callback);
            });

            it("should pass data to callback", function () {
                expect(callback).toHaveBeenCalledWith(buffer);
            });

            it("should return return value of callback", function () {
                expect(result).toBe(returnValue);
            });
        });
    });
});
