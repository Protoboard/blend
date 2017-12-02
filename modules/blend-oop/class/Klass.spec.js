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
    });

    describe("delegate()", function () {
      var Mixer,
          members;

      beforeEach(function () {
        Class = classBuilder.build();
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

    describe("forwardBlend()", function () {
      var Mixin,
          callback;

      beforeEach(function () {
        Mixin = $oop.createClass('Mixin').build();
        callback = function () {};
        Class = classBuilder.build();
      });

      it("should return self", function () {
        var result = Class.forwardBlend(Mixin);
        expect(result).toBe(Class);
      });

      it("should invoke forwardBlend on builder", function () {
        spyOn(Class.__builder, 'forwardBlend');
        Class.forwardBlend(Mixin, callback);
        expect(Class.__builder.forwardBlend)
        .toHaveBeenCalledWith(Mixin, callback);
      });
    });

    describe("mixes()", function () {
      var mixinBuilder1,
          mixinBuilder2,
          Mixin1,
          Mixin2;

      beforeEach(function () {
        mixinBuilder1 = $oop.createClass('Mixin1');
        mixinBuilder2 = $oop.createClass('Mixin2');
        Mixin1 = mixinBuilder1.build();
        Mixin2 = mixinBuilder2.build();
        classBuilder.mix(Mixin1);
        Class = classBuilder.build();
      });

      describe("on present mixin", function () {
        it("should return truthy", function () {
          expect(Class.mixes(Mixin1)).toBeTruthy();
        });
      });

      describe("on absent mixin", function () {
        it("should return falsy", function () {
          expect(Class.mixes(Mixin2)).toBeFalsy();
        });
      });
    });

    describe("mixedBy()", function () {
      var mixinBuilder1,
          mixinBuilder2,
          Mixin1,
          Mixin2;

      beforeEach(function () {
        mixinBuilder1 = $oop.createClass('Mixin1');
        mixinBuilder2 = $oop.createClass('Mixin2');
        Mixin1 = mixinBuilder1.build();
        Mixin2 = mixinBuilder2.build();
        classBuilder.mix(Mixin1);
        Class = classBuilder.build();
      });

      describe("on present mixin", function () {
        it("should return truthy", function () {
          expect(Mixin1.mixedBy(Class)).toBeTruthy();
        });
      });

      describe("on absent mixin", function () {
        it("should return falsy", function () {
          expect(Mixin2.mixedBy(Class)).toBeFalsy();
        });
      });
    });
  });
});