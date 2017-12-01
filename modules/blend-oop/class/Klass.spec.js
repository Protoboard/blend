"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'];

describe("$assert", function () {
  var Klass;

  beforeEach(function () {
    Klass = $oop.createClass('Klass').build();
  });

  describe("isKlass()", function () {
    beforeEach(function () {
      spyOn($assert, 'assert').and.callThrough();
    });

    it("should pass message to assert", function () {
      $assert.isKlass(Klass, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing Klass", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.isKlass(Klass);
        }).not.toThrow();
      });
    });

    describe("when passing non-Klass", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isKlass(undefined);
        }).toThrow();
        expect(function () {
          $assert.isKlass(null);
        }).toThrow();
        expect(function () {
          $assert.isKlass("hello");
        }).toThrow();
        expect(function () {
          $assert.isKlass(true);
        }).toThrow();
        expect(function () {
          $assert.isKlass(1);
        }).toThrow();
        expect(function () {
          $assert.isKlass({});
        }).toThrow();
      });
    });
  });

  describe("isKlassOptional()", function () {
    beforeEach(function () {
      spyOn($assert, 'assert').and.callThrough();
    });

    it("should pass message to assert", function () {
      $assert.isKlassOptional(Klass, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing undefined", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.isKlassOptional(undefined);
        }).not.toThrow();
      });
    });
  });
});

describe("$oop", function () {
  describe("Klass", function () {
    var classBuilder,
        Class;

    beforeEach(function () {
      classBuilder = $oop.createClass('Class');
      Class = classBuilder.build();
    });

    describe("delegate()", function () {
      var Mixer,
          members;

      beforeEach(function () {
        Mixer = $oop.createClass('Mixer')
        .mix(Class)
        .build();
        members = {
          foo: function () {}
        };
        spyOn(classBuilder, 'delegate');
      });

      it("should return self", function () {
        var result = Class.delegate(members);
        expect(result).toBe(Class);
      });

      it("should invoke delegation on builder", function () {
        Class.delegate(members);
        expect(classBuilder.delegate).toHaveBeenCalledWith(members);
      });

      it("should set delegates", function () {
        Class.delegate(members);
        expect(Class.foo).toBe(members.foo);
      });

      it("should transfer delegates", function () {
        Class.delegate(members);
        expect(Mixer.foo).toBe(members.foo);
      });
    });
  });
});