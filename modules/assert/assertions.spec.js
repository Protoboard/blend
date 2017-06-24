"use strict";

var $assert = window['giant-assert'];

describe("$assert", function () {
  beforeEach(function () {
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isDefined()", function () {
    describe("when passing null or undefined", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.isDefined(null);
        }).not.toThrow();
        expect(function () {
          $assert.isDefined(undefined);
        }).toThrow();
      });
    });

    it("should return self", function () {
      expect($assert.isDefined("foo", "bar")).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isDefined("foo", "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isUndefined()", function () {
    describe("when passing non-undefined", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isUndefined(1);
        }).toThrow();
        expect(function () {
          $assert.isUndefined("foo");
        }).toThrow();
        expect(function () {
          $assert.isUndefined(null);
        }).toThrow();
      });
    });

    it("should return self", function () {
      expect($assert.isUndefined(undefined, "bar")).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isUndefined(undefined, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isString()", function () {
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

    it("should return self", function () {
      expect($assert.isString("foo")).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isString("foo", "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isStringOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isStringOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isStringOptional("foo", "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });

  describe("isBoolean()", function () {
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

    it("should return self", function () {
      expect($assert.isBoolean(true)).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isBoolean(false, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isBooleanOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isBooleanOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isBooleanOptional(false, "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });

  describe("isNumber()", function () {
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

    it("should return self", function () {
      expect($assert.isNumber(1)).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isNumber(1, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isNumberOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isNumberOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isNumberOptional(1, "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });

  describe("isFunction()", function () {
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

    it("should return self", function () {
      expect($assert.isFunction(function () {})).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isFunction(function () {}, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isFunctionOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isFunctionOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isFunctionOptional(function () {}, "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });

  describe("isObject()", function () {

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

    it("should return self", function () {
      expect($assert.isObject({})).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isObject({}, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("iObjectOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isObjectOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isObjectOptional({}, "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });

  describe("isArray()", function () {
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

    it("should return self", function () {
      expect($assert.isArray([])).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isArray([], "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isArrayOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isArrayOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isArrayOptional([], "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });

  describe("isRegExp()", function () {
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

    it("should return self", function () {
      expect($assert.isRegExp(/abc/)).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isRegExp(/abc/, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isRegExpOptional()", function () {
    describe("when passing undefined", function () {
      it("should pass message to assert", function () {
        $assert.isRegExpOptional(/a/, "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });

      it("should return self", function () {
        expect($assert.isRegExpOptional()).toBe($assert);
      });
    });
  });

  describe("isDate()", function () {
    describe("when passing non-date", function () {
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

    it("should return self", function () {
      expect($assert.isDate(new Date())).toBe($assert);
    });

    it("should pass message to assert", function () {
      $assert.isDate(new Date(), "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });
  });

  describe("isDateOptional()", function () {
    describe("when passing undefined", function () {
      it("should return self", function () {
        expect($assert.isDateOptional()).toBe($assert);
      });

      it("should pass message to assert", function () {
        $assert.isDateOptional(new Date(), "bar");
        expect($assert.assert).toHaveBeenCalledWith(true, "bar");
      });
    });
  });
});