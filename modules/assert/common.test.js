"use strict";

var $assert = window['giant-assert'];

describe("Common assertions", function () {
    beforeEach(function () {
        spyOn($assert, 'assert').and.callThrough();
    });

    describe("value checker", function () {
        describe("when passing legitimate value", function () {
            it("should pass message to assert", function () {
                $assert.hasValue("foo", "bar");
                expect($assert.assert).toHaveBeenCalledWith(true, "bar");
            });

            it("should not throw", function () {
                expect(function () {
                    $assert.hasValue("foo");
                }).not.toThrow();
                expect(function () {
                    $assert.hasValue(1);
                }).not.toThrow();
                expect(function () {
                    $assert.hasValue({});
                }).not.toThrow();
            });
        });

        describe("when passing null or undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.hasValue(null);
                }).not.toThrow();
                expect(function () {
                    $assert.hasValue(undefined);
                }).toThrow();
            });
        });
    });

    describe("string checker", function () {
        it("should pass message to assert", function () {
            $assert.isString("foo", "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing string", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isString("hello");
                }).not.toThrow();
            });
        });

        describe("when passing non-string", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isString(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isString(null);
                }).toThrow();
                expect(function () {
                    $assert.isString(1);
                }).toThrow();
            });
        });
    });

    describe("optional string checker", function () {
        it("should pass message to assert", function () {
            $assert.isStringOptional("foo", "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isStringOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("boolean checker", function () {
        it("should pass message to assert", function () {
            $assert.isBoolean(false, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing boolean", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isBoolean(true);
                }).not.toThrow();
            });
        });

        describe("when passing non-boolean", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isBoolean(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isBoolean(null);
                }).toThrow();
                expect(function () {
                    $assert.isBoolean("hello");
                }).toThrow();
                expect(function () {
                    $assert.isBoolean(1);
                }).toThrow();
            });
        });
    });

    describe("optional boolean checker", function () {
        it("should pass message to assert", function () {
            $assert.isBooleanOptional(false, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isBooleanOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("number checker", function () {
        it("should pass message to assert", function () {
            $assert.isNumber(1, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing number", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isNumber(1);
                }).not.toThrow();
            });
        });

        describe("when passing non-number", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isNumber(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isNumber(null);
                }).toThrow();
                expect(function () {
                    $assert.isNumber("hello");
                }).toThrow();
                expect(function () {
                    $assert.isNumber(true);
                }).toThrow();
            });
        });
    });

    describe("optional number checker", function () {
        it("should pass message to assert", function () {
            $assert.isNumberOptional(1, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isNumberOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("function checker", function () {
        it("should pass message to assert", function () {
            $assert.isFunction(function () {}, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing function", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isFunction(function () {});
                }).not.toThrow();
            });
        });

        describe("when passing non-function", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isFunction(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isFunction(null);
                }).toThrow();
                expect(function () {
                    $assert.isFunction("hello");
                }).toThrow();
                expect(function () {
                    $assert.isFunction(true);
                }).toThrow();
                expect(function () {
                    $assert.isFunction(1);
                }).toThrow();
            });
        });
    });

    describe("optional function checker", function () {
        it("should pass message to assert", function () {
            $assert.isFunctionOptional(function () {}, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isFunctionOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("object checker", function () {
        it("should pass message to assert", function () {
            $assert.isObject({}, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing object", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isObject({});
                }).not.toThrow();
            });
        });

        describe("when passing non-object", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isObject(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isObject(null);
                }).toThrow();
                expect(function () {
                    $assert.isObject("hello");
                }).toThrow();
                expect(function () {
                    $assert.isObject(true);
                }).toThrow();
                expect(function () {
                    $assert.isObject(1);
                }).toThrow();
            });
        });
    });

    describe("optional object checker", function () {
        it("should pass message to assert", function () {
            $assert.isObjectOptional({}, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isObjectOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("array checker", function () {
        it("should pass message to assert", function () {
            $assert.isArray([], "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing array", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isArray([]);
                }).not.toThrow();
            });
        });

        describe("when passing non-array", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isArray(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isArray(null);
                }).toThrow();
                expect(function () {
                    $assert.isArray("hello");
                }).toThrow();
                expect(function () {
                    $assert.isArray(true);
                }).toThrow();
                expect(function () {
                    $assert.isArray(1);
                }).toThrow();
                expect(function () {
                    $assert.isArray({});
                }).toThrow();
            });
        });
    });

    describe("optional array checker", function () {
        it("should pass message to assert", function () {
            $assert.isArrayOptional([], "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isArrayOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("regexp checker", function () {
        it("should pass message to assert", function () {
            $assert.isRegExp(/abc/, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing regexp", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isRegExp(/a/);
                }).not.toThrow();
            });
        });

        describe("when passing non-regexp", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isRegExp(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isRegExp(null);
                }).toThrow();
                expect(function () {
                    $assert.isRegExp("hello");
                }).toThrow();
                expect(function () {
                    $assert.isRegExp(true);
                }).toThrow();
                expect(function () {
                    $assert.isRegExp(1);
                }).toThrow();
                expect(function () {
                    $assert.isRegExp({});
                }).toThrow();
            });
        });
    });

    describe("optional regexp checker", function () {
        it("should pass message to assert", function () {
            $assert.isRegExpOptional(/a/, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isRegExpOptional(undefined);
                }).not.toThrow();
            });
        });
    });

    describe("date checker", function () {
        it("should pass message to assert", function () {
            $assert.isDate(new Date(), "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing regexp", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isDate(new Date());
                }).not.toThrow();
            });
        });

        describe("when passing non-regexp", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isDate(undefined);
                }).toThrow();
                expect(function () {
                    $assert.isDate(null);
                }).toThrow();
                expect(function () {
                    $assert.isDate("hello");
                }).toThrow();
                expect(function () {
                    $assert.isDate(true);
                }).toThrow();
                expect(function () {
                    $assert.isDate(1);
                }).toThrow();
                expect(function () {
                    $assert.isDate({});
                }).toThrow();
            });
        });
    });

    describe("optional date checker", function () {
        it("should pass message to assert", function () {
            $assert.isDateOptional(new Date(), "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing undefined", function () {
            it("should not throw", function () {
                expect(function () {
                    $assert.isDateOptional(undefined);
                }).not.toThrow();
            });
        });
    });
});