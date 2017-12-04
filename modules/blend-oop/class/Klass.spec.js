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

    describe("create()", function () {
      var instance;

      it("should copy properties", function () {
        Class = classBuilder.build();
        instance = Class.create({
          foo: 'FOO',
          bar: 'BAR'
        }, {
          bar: "Bar",
          baz: "Baz"
        });
        expect(instance.foo).toBe('FOO');
        expect(instance.bar).toBe('Bar');
        expect(instance.baz).toBe('Baz');
      });

      describe("when any of the arguments is falsy", function () {
        it("should discard falsy arguments", function () {
          Class = classBuilder.build();
          instance = Class.create(
              null,
              {
                foo: 'FOO',
                bar: 'BAR'
              },
              undefined,
              {
                bar: "Bar",
                baz: "Baz"
              });
          expect(instance.foo).toBe('FOO');
          expect(instance.bar).toBe('Bar');
          expect(instance.baz).toBe('Baz');
        });
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          Class = classBuilder.build();
          expect(function () {
            Class.create(1);
          }).toThrow();
          expect(function () {
            Class.create('foo');
          }).toThrow();
          expect(function () {
            Class.create(true);
          }).toThrow();
        });
      });

      describe("when defaults is defined", function () {
        var defaults,
            properties;

        beforeEach(function () {
          properties = {};
          defaults = jasmine.createSpy();
          classBuilder.define({
            defaults: defaults
          });
          Class = classBuilder.build();
        });

        it("should invoke defaults", function () {
          Class.create(properties);
          expect(defaults).toHaveBeenCalled();
        });
      });

      describe("when spread is defined", function () {
        var spread,
            properties;

        beforeEach(function () {
          properties = {};
          spread = jasmine.createSpy();
          classBuilder.define({
            spread: spread
          });
          Class = classBuilder.build();
        });

        it("should invoke spread", function () {
          Class.create(properties);
          expect(spread).toHaveBeenCalledWith();
        });
      });

      describe("when init is defined", function () {
        var init,
            properties;

        beforeEach(function () {
          properties = {};
          init = jasmine.createSpy();
          classBuilder.define({
            init: init
          });
          Class = classBuilder.build();
        });

        it("should invoke init", function () {
          Class.create(properties);
          expect(init).toHaveBeenCalledWith();
        });
      });

      describe("of mixin", function () {
        var Host;

        beforeEach(function () {
          Host = $oop.createClass('Host').build();
          classBuilder.expect(Host);
          Class = classBuilder.build();
        });

        it("should throw", function () {
          expect(function () {
            Class.create();
          }).toThrow();
        });
      });

      describe("of cached class", function () {
        var context;

        beforeEach(function () {
          classBuilder.cacheBy(function (args) {
            context = this;
            return args.foo && // return undefined when args.foo is undefined
                '_' + args.foo; // otherwise a prefixed version of it
          });
        });

        it("should pass class to mapper as context", function () {
          Class = classBuilder.build();
          instance = Class.create({foo: 'foo'});
          expect(context).toBe(Class);
        });

        describe("when instance is not cached yet", function () {
          it("should store new instance in cache", function () {
            Class = classBuilder.build();
            instance = Class.create({foo: 'foo'});
            expect(Class.__builder.instances).toEqual({
              '_foo': instance
            });
          });
        });

        describe("when instance does not satisfy mapper", function () {
          it("should not store new instance in cache", function () {
            Class = classBuilder.build();
            instance = Class.create({foo: undefined});
            expect(Class.__builder.instances).toEqual({});
          });
        });

        describe("when instance is already cached", function () {
          var cached;

          beforeEach(function () {
            Class = classBuilder.build();
            Class.create({foo: 'foo'});
            cached = Class.__builder.instances._foo;
          });

          it("should return cached instance", function () {
            instance = Class.create({foo: 'foo'});
            expect(instance).toBe(cached);
          });
        });
      });

      describe("of unimplemented class", function () {
        var Interface;

        beforeEach(function () {
          Interface = $oop.createClass('Interface')
          .define({
            foo: function () {
            }
          })
          .build();
          classBuilder.implement(Interface);
          Class = classBuilder.build();
        });

        it("should throw", function () {
          expect(function () {
            Class.create();
          }).toThrow();
        });
      });

      describe("of forwarded class", function () {
        var ForwardMixin;

        beforeEach(function () {
          ForwardMixin = $oop.createClass('ForwardMixin').build();
          Class = classBuilder.build();
          Class.forwardBlend(ForwardMixin, function (properties) {
            return properties.foo;
          });
        });

        it("should instantiate forwarded class", function () {
          var result = Class.create({foo: true});
          expect(Class.mixedBy(result)).toBeTruthy();
          expect(ForwardMixin.mixedBy(result)).toBeTruthy();
        });
      });
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

    describe("implements()", function () {
      var interfaceBuilder1,
          interfaceBuilder2,
          Interface1,
          Interface2;

      beforeEach(function () {
        interfaceBuilder1 = $oop.createClass('Interface1');
        interfaceBuilder2 = $oop.createClass('Interface2');
        Interface1 = interfaceBuilder1.build();
        Interface2 = interfaceBuilder2.build();
        classBuilder.implement(Interface1);
        Class = classBuilder.build();
      });

      describe("on implemented interface", function () {
        it("should return truthy", function () {
          expect(Class.implements(Interface1)).toBeTruthy();
        });
      });

      describe("on other interface", function () {
        it("should return falsy", function () {
          expect(Class.implements(Interface2)).toBeFalsy();
        });
      });
    });

    describe("implementedBy()", function () {
      var interfaceBuilder1,
          interfaceBuilder2,
          Interface1,
          Interface2;

      beforeEach(function () {
        interfaceBuilder1 = $oop.createClass('Interface1');
        interfaceBuilder2 = $oop.createClass('Interface2');
        Interface1 = interfaceBuilder1.build();
        Interface2 = interfaceBuilder2.build();
        classBuilder.implement(Interface1);
        Class = classBuilder.build();
      });

      describe("on implemented interface", function () {
        it("should return truthy", function () {
          expect(Interface1.implementedBy(Class)).toBeTruthy();
        });
      });

      describe("on other interface", function () {
        it("should return falsy", function () {
          expect(Interface2.implementedBy(Class)).toBeFalsy();
        });
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

      describe("on self", function () {
        it("should return truthy", function () {
          expect(Class.mixes(Class)).toBeTruthy();
        });
      });

      describe("on instance of self", function () {
        it("should return truthy", function () {
          var instance = Class.create();
          expect(instance.mixes(Class)).toBeTruthy();
        });
      });

      describe("on present mixin", function () {
        it("should return truthy", function () {
          expect(Class.mixes(Mixin1)).toBeTruthy();
          var instance = Class.create();
          expect(instance.mixes(Mixin1)).toBeTruthy();
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

      describe("on self", function () {
        it("should return truthy", function () {
          expect(Class.mixedBy(Class)).toBeTruthy();
        });
      });

      describe("on instance of self", function () {
        it("should return truthy", function () {
          var instance = Class.create();
          expect(Class.mixedBy(instance)).toBeTruthy();
        });
      });

      describe("on present mixin", function () {
        it("should return truthy", function () {
          expect(Mixin1.mixedBy(Class)).toBeTruthy();
          var instance = Class.create();
          expect(Mixin1.mixedBy(instance)).toBeTruthy();
        });
      });

      describe("on absent mixin", function () {
        it("should return falsy", function () {
          expect(Mixin2.mixedBy(Class)).toBeFalsy();
        });
      });
    });

    describe("expects()", function () {
      var hostBuilder1,
          hostBuilder2,
          Host1,
          Host2;

      beforeEach(function () {
        hostBuilder1 = $oop.createClass('Host1');
        hostBuilder2 = $oop.createClass('Host2');
        Host1 = hostBuilder1.build();
        Host2 = hostBuilder2.build();
        classBuilder.expect(Host1);
        Class = classBuilder.build();
      });

      describe("on met expectation", function () {
        it("should return truthy", function () {
          expect(Class.expects(Host1)).toBeTruthy();
        });
      });

      describe("on unmet expectation", function () {
        it("should return falsy", function () {
          expect(Class.expects(Host2)).toBeFalsy();
        });
      });
    });

    describe("expectedBy()", function () {
      var hostBuilder1,
          hostBuilder2,
          Host1,
          Host2;

      beforeEach(function () {
        hostBuilder1 = $oop.createClass('Host1');
        hostBuilder2 = $oop.createClass('Host2');
        Host1 = hostBuilder1.build();
        Host2 = hostBuilder2.build();
        classBuilder.expect(Host1);
        Class = classBuilder.build();
      });

      describe("on met expectation", function () {
        it("should return truthy", function () {
          expect(Host1.expectedBy(Class)).toBeTruthy();
        });
      });

      describe("on unmet expectation", function () {
        it("should return falsy", function () {
          expect(Host2.expectedBy(Class)).toBeFalsy();
        });
      });
    });

    describe("elevateMethods()", function () {
      var instance;

      beforeEach(function () {
        classBuilder.define({
          foo: function () {},
          bar: function () {}
        });
        Class = classBuilder.build();
        instance = $oop.createObject(Class, {});
      });

      describe("when passing absent methodName", function () {
        it("should throw", function () {
          expect(function () {
            instance.elevateMethods('baz');
          }).toThrow();
        });
      });

      it("should add elevated method", function () {
        instance.elevateMethods('foo');
        expect(instance.hasOwnProperty('foo')).toBeTruthy();
        expect(typeof instance.foo).toBe('function');
        expect(instance.foo).not.toBe(Class.foo);
      });

      describe("when method is already elevated", function () {
        var elevated;

        beforeEach(function () {
          instance.elevateMethods('foo');
          elevated = instance.foo;
        });

        it("should replace elevated method", function () {
          instance.elevateMethods('foo');
          expect(instance.foo).not.toBe(elevated);
        });
      });
    });
  });
});