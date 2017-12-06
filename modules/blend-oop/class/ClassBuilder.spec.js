"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("ClassBuilder", function () {
    var classBuilder;

    describe("create()", function () {
      it("should create ClassBuilder instance", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect($oop.ClassBuilder.isPrototypeOf(classBuilder)).toBeTruthy();
      });

      it("should initialize classId", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.classId).toBe($oop.ClassBuilder.lastClassId);
      });

      it("should initialize className", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.className).toBe('foo');
      });

      it("should initialize Class", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.Class).toBeUndefined();
      });

      it("should initialize members", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.members).toEqual({});
      });

      it("should initialize mixins", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.mixins).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize interfaces", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.interfaces).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize expectations", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.expectations).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize mapper", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.mapper).toBeUndefined();
      });

      it("should initialize instances", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.instances).toEqual({});
      });

      it("should initialize delegates", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.delegates).toEqual({});
      });

      it("should initialize forwards", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.forwards).toEqual({list: [], lookup: {}});
      });
    });

    describe("define()", function () {
      var members;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        members = {
          foo: 'bar'
        };
      });

      describe("on invalid members", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.define();
          }).toThrow();
          expect(function () {
            classBuilder.define('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        var result = classBuilder.define(members);
        expect(result).toBe(classBuilder);
      });

      it("should copy members", function () {
        classBuilder.define(members);
        expect(classBuilder.members).toEqual(members);
      });
    });

    describe("mix()", function () {
      var mixinBuilder,
          Mixin;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        mixinBuilder = $oop.ClassBuilder.create('bar');
      });

      describe("on invalid Class", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.mix();
          }).toThrow();
          expect(function () {
            classBuilder.mix('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        Mixin = mixinBuilder.build();
        var result = classBuilder.mix(Mixin);
        expect(result).toBe(classBuilder);
      });

      it("should add to mixins", function () {
        Mixin = mixinBuilder.build();
        classBuilder.mix(Mixin);
        expect(classBuilder.mixins.downstream).toEqual({
          list: [mixinBuilder],
          lookup: {
            bar: 1
          }
        });
      });

      it("should add self to mixin's mixers", function () {
        Mixin = mixinBuilder.build();
        classBuilder.mix(Mixin);
        expect(mixinBuilder.mixins.upstream).toEqual({
          list: [classBuilder],
          lookup: {
            foo: 1
          }
        });
      });

      describe("when mixin has expectations", function () {
        var expectedBuilder,
            Expected;

        beforeEach(function () {
          expectedBuilder = $oop.createClass('baz');
          Expected = expectedBuilder.build();
          mixinBuilder.expect(Expected);
        });

        it("should transfer Expected", function () {
          Mixin = mixinBuilder.build();
          classBuilder.mix(Mixin);
          expect(classBuilder.expectations.downstream).toEqual({
            list: [expectedBuilder],
            lookup: {
              baz: 1
            }
          });
        });
      });

      describe("when mixin has mapper", function () {
        var mapper;

        beforeEach(function () {
          mapper = function () {};
          mixinBuilder.cacheBy(mapper);
        });

        it("should transfer mapper", function () {
          Mixin = mixinBuilder.build();
          classBuilder.mix(Mixin);
          expect(classBuilder.mapper).toBe(mapper);
        });
      });

      describe("when mixin has delegates", function () {
        var members;

        beforeEach(function () {
          members = {
            foo: function () {}
          };
          mixinBuilder.delegate(members);
        });

        it("should transfer delegates", function () {
          Mixin = mixinBuilder.build();
          classBuilder.mix(Mixin);
          expect(classBuilder.delegates).toEqual(members);
        });
      });

      describe("when mixin has forwards", function () {
        var forwardBuilder,
            Forward,
            callback = function () {};

        beforeEach(function () {
          Mixin = mixinBuilder.build();
          forwardBuilder = $oop.createClass('Forward');
          Forward = forwardBuilder.build();
          mixinBuilder.forwardBlend(Forward, callback);
        });

        it("should transfer forwards", function () {
          classBuilder.mix(Mixin);
          expect(classBuilder.forwards).toEqual({
            list: [{
              mixin: forwardBuilder,
              callback: callback
            }],
            lookup: {
              Forward: 1
            }
          });
        });
      });

      describe("when mixing a forward", function () {
        var callback = function () {};

        beforeEach(function () {
          Mixin = mixinBuilder.build();
          classBuilder.forwardBlend(Mixin, callback);
        });

        it("should remove affected forward", function () {

        });
      });

      describe("when mixing again", function () {
        beforeEach(function () {
          Mixin = mixinBuilder.build();
          classBuilder.mix(Mixin);
        });

        it("should not add mixin to downstream mixins again", function () {
          classBuilder.mix(Mixin);
          expect(classBuilder.mixins.downstream).toEqual({
            list: [mixinBuilder],
            lookup: {
              bar: 1
            }
          });
        });

        it("should not add self to mixin's upstream mixins again", function () {
          classBuilder.mix(Mixin);
          expect(mixinBuilder.mixins.upstream).toEqual({
            list: [classBuilder],
            lookup: {
              foo: 1
            }
          });
        });
      });
    });

    describe("blend()", function () {
      var mixinBuilder1,
          mixinBuilder2,
          mixinBuilder3,
          Mixin1,
          Mixin2,
          Mixin3;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        mixinBuilder1 = $oop.ClassBuilder.create('bar');
        mixinBuilder2 = $oop.ClassBuilder.create('baz');
        mixinBuilder3 = $oop.ClassBuilder.create('quux');
        Mixin1 = mixinBuilder1.build();
        Mixin2 = mixinBuilder2.build();
        Mixin3 = mixinBuilder3.build();
        mixinBuilder1.mix(Mixin2);
        mixinBuilder2.mix(Mixin3);
      });

      describe("on invalid Class", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.blend();
          }).toThrow();
          expect(function () {
            classBuilder.blend('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        var result = classBuilder.blend(Mixin1);
        expect(result).toBe(classBuilder);
      });

      it("should mix entire subtree", function () {
        classBuilder.blend(Mixin1);
        expect(classBuilder.mixins.downstream.list).toEqual([
          mixinBuilder3,
          mixinBuilder2,
          mixinBuilder1
        ]);
      });

      describe("on multiple equivalent paths in subtree", function () {
        beforeEach(function () {
          mixinBuilder2.mix(Mixin3);
        });

        it("should use earliest mixin occurrence", function () {
          classBuilder.blend(Mixin1);
          expect(classBuilder.mixins.downstream.list).toEqual([
            mixinBuilder3,
            mixinBuilder2,
            mixinBuilder1
          ]);
        });
      });
    });

    describe("implement()", function () {
      var interfaceBuilder,
          Interface;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        interfaceBuilder = $oop.ClassBuilder.create('bar')
        .define({
          foo: function () {}
        });
        Interface = interfaceBuilder.build();
      });

      describe("on invalid Interface", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.implement();
          }).toThrow();
          expect(function () {
            classBuilder.implement('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        var result = classBuilder.implement(Interface);
        expect(result).toBe(classBuilder);
      });

      it("should add Interface builder to interfaces", function () {
        classBuilder.implement(Interface);
        expect(classBuilder.interfaces.downstream).toEqual({
          list: [interfaceBuilder],
          lookup: {
            bar: 1
          }
        });
      });

      it("should add self to Interface's implementers", function () {
        classBuilder.implement(Interface);
        expect(interfaceBuilder.interfaces.upstream).toEqual({
          list: [classBuilder],
          lookup: {
            foo: 1
          }
        });
      });

      describe("when implementing again", function () {
        beforeEach(function () {
          classBuilder.implement(Interface);
        });

        it("should not add Interface to interfaces again", function () {
          classBuilder.implement(Interface);
          expect(classBuilder.interfaces.downstream).toEqual({
            list: [interfaceBuilder],
            lookup: {
              bar: 1
            }
          });
        });

        it("should not add self to Interface's implementers again", function () {
          classBuilder.implement(Interface);
          expect(interfaceBuilder.interfaces.upstream).toEqual({
            list: [classBuilder],
            lookup: {
              foo: 1
            }
          });
        });
      });
    });

    describe("expect()", function () {
      var expectedBuilder,
          Expected;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expectedBuilder = $oop.ClassBuilder.create('bar');
      });

      describe("on invalid Class", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.expect();
          }).toThrow();
          expect(function () {
            classBuilder.expect('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        Expected = expectedBuilder.build();
        var result = classBuilder.expect(Expected);
        expect(result).toBe(classBuilder);
      });

      it("should add Class builder to expected", function () {
        Expected = expectedBuilder.build();
        classBuilder.expect(Expected);
        expect(classBuilder.expectations.downstream).toEqual({
          list: [expectedBuilder],
          lookup: {
            bar: 1
          }
        });
      });

      it("should add self to Class' expecters", function () {
        Expected = expectedBuilder.build();
        classBuilder.expect(Expected);
        expect(expectedBuilder.expectations.upstream).toEqual({
          list: [classBuilder],
          lookup: {
            foo: 1
          }
        });
      });

      describe("when Expected has mixins", function () {
        var mixinBuilder,
            Mixin;

        beforeEach(function () {
          mixinBuilder = $oop.createClass('baz');
          Mixin = mixinBuilder.build();
          expectedBuilder.mix(Mixin);
        });

        it("should transfer mixin as expected", function () {
          Expected = expectedBuilder.build();
          classBuilder.expect(Expected);
          expect(classBuilder.expectations.downstream).toEqual({
            list: [expectedBuilder, mixinBuilder],
            lookup: {
              bar: 1,
              baz: 1
            }
          });
        });
      });

      describe("when expecting again", function () {
        beforeEach(function () {
          Expected = expectedBuilder.build();
          classBuilder.expect(Expected);
        });

        it("should not add Class to expected again", function () {
          classBuilder.expect(Expected);
          expect(classBuilder.expectations.downstream).toEqual({
            list: [expectedBuilder],
            lookup: {
              bar: 1
            }
          });
        });

        it("should not add self to Class' expecters again", function () {
          classBuilder.expect(Expected);
          expect(expectedBuilder.expectations.upstream).toEqual({
            list: [classBuilder],
            lookup: {
              foo: 1
            }
          });
        });
      });
    });

    describe("cacheBy()", function () {
      var mapper;

      beforeEach(function () {
        mapper = function () {};
        classBuilder = $oop.ClassBuilder.create('foo');
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.cacheBy();
          }).toThrow();
          expect(function () {
            classBuilder.cacheBy('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        var result = classBuilder.cacheBy(mapper);
        expect(result).toBe(classBuilder);
      });

      it("should set mapper", function () {
        classBuilder.cacheBy(mapper);
        expect(classBuilder.mapper).toBe(mapper);
      });
    });

    describe("build()", function () {
      var Class,
          classes,
          classByClassId,
          classByClassName,
          classByMixinIds;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        classes = $oop.classes;
        $oop.classes = [];
        classByClassId = $oop.classByClassId;
        $oop.classByClassId = {};
        classByClassName = $oop.classByClassName;
        $oop.classByClassName = {};
        classByMixinIds = $oop.classByMixinIds;
        $oop.classByMixinIds = {};
        $oop.ClassBuilder.lastClassId = -1;
      });

      afterEach(function () {
        $oop.classes = classes;
        $oop.classByClassId = classByClassId;
        $oop.classByClassName = classByClassName;
        $oop.classByMixinIds = classByMixinIds;
      });

      describe("when already built", function () {
        beforeEach(function () {
          classBuilder.build();
        });

        it("should throw", function () {
          expect(function () {
            classBuilder.build();
          }).toThrow();
        });
      });

      it("should return Class instance", function () {
        Class = classBuilder.build();
        expect($oop.Class.isPrototypeOf(Class)).toBeTruthy();
      });

      it("should initialize __classId", function () {
        Class = classBuilder.build();
        expect(Class.__classId).toBe(classBuilder.classId);
      });

      it("should initialize __className", function () {
        Class = classBuilder.build();
        expect(Class.__className).toBe('foo');
      });

      it("should initialize __builder", function () {
        Class = classBuilder.build();
        expect(Class.__builder).toBe(classBuilder);
      });

      it("should set Class", function () {
        Class = classBuilder.build();
        expect(classBuilder.Class).toBe(Class);
      });

      describe("when class implements interfaces", function () {
        var interfaceBuilder,
            Interface;

        beforeEach(function () {
          interfaceBuilder = $oop.createClass('Interface')
          .define({
            foo: function () {}
          });
          Interface = interfaceBuilder.build();
          classBuilder.implement(Interface);
          $oop.ClassBuilder.lastClassId = -1;
        });

        it("should set unimplementedInterfaces", function () {
          Class = classBuilder.build();
          expect(classBuilder.unimplementedInterfaces).toEqual([
            interfaceBuilder
          ]);
        });
      });

      describe("when class has expectations", function () {
        var expectationBuilder,
            Expectation;

        beforeEach(function () {
          expectationBuilder = $oop.createClass('Expectation');
          Expectation = expectationBuilder.build();
          classBuilder.expect(Expectation);
        });

        it("should set unimplementedInterfaces", function () {
          Class = classBuilder.build();
          expect(classBuilder.unmetExpectations).toEqual([
            expectationBuilder
          ]);
        });
      });

      it("should store class in classes", function () {
        Class = classBuilder.build();
        expect($oop.classes).toEqual([Class]);
      });

      it("should store class in classByClassId", function () {
        Class = classBuilder.build();
        expect($oop.classByClassId).toEqual({
          0: Class
        });
      });

      it("should store class in classByClassName", function () {
        Class = classBuilder.build();
        expect($oop.classByClassName).toEqual({
          foo: Class
        });
      });

      describe("when class has members & mixins", function () {
        var Mixin1,
            Mixin2,
            method1,
            method2,
            method3;

        beforeEach(function () {
          method1 = jasmine.createSpy();
          method2 = jasmine.createSpy();
          method3 = jasmine.createSpy();
          classBuilder.define({
            foo: 'bar',
            baz: method1
          });
          Mixin1 = $oop.createClass('Mixin1')
          .define({
            foo: 'BAR',
            quux: method2
          })
          .build();
          Mixin2 = $oop.createClass('Mixin2')
          .mix(Mixin1)
          .define({
            baz: method3
          })
          .build();
          classBuilder.blend(Mixin2);
        });

        it("should compact methods & properties", function () {
          Class = classBuilder.build();
          expect(Class.foo).toBe('bar');
          expect(Class.quux).toBe(method2);
          Class.baz('foo');
          expect(method1).toHaveBeenCalledWith('foo');
          expect(method3).toHaveBeenCalledWith('foo');
        });

        it("should add class to BlenderIndex", function () {
          Class = classBuilder.build();
          expect($oop.classByMixinIds).toEqual({
            '0,1': Mixin2,
            '0,1,2': Class
          });
        });

        describe("for ad-hoc class", function () {
          beforeEach(function () {
            classBuilder.className = undefined;
          });

          it("should add to BlenderIndex by mixins only", function () {
            Class = classBuilder.build();
            expect($oop.classByMixinIds).toEqual({
              '0,1': Mixin2
            });
          });
        });
      });

      describe("when class has delegates", function () {
        var members;

        beforeEach(function () {
          members = {
            foo: function () {}
          };
          classBuilder.delegate(members);
        });

        it("should copy delegates to class", function () {
          Class = classBuilder.build();
          expect(Class.foo).toBe(members.foo);
        });
      });
    });

    describe("delegate()", function () {
      var members;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        members = {
          foo: 'bar'
        };
      });

      describe("on invalid members", function () {
        it("should throw", function () {
          expect(function () {
            classBuilder.delegate();
          }).toThrow();
          expect(function () {
            classBuilder.delegate('foo');
          }).toThrow();
        });
      });

      it("should return self", function () {
        var result = classBuilder.delegate(members);
        expect(result).toBe(classBuilder);
      });

      it("should copy members", function () {
        classBuilder.delegate(members);
        expect(classBuilder.delegates).toEqual(members);
      });

      describe("when Class has mixers", function () {
        var mixerBuilder,
            Class;
        beforeEach(function () {
          Class = classBuilder.build();
          mixerBuilder = $oop.createClass('Mixer')
          .mix(Class);
        });

        it("should transfer delegates to mixers", function () {
          classBuilder.delegate(members);
          expect(mixerBuilder.delegates).toEqual(members);
        });
      });
    });

    describe("forwardBlend()", function () {
      var mixinBuilder,
          Mixin,
          callback;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        mixinBuilder = $oop.ClassBuilder.create('bar');
        Mixin = mixinBuilder.build();
        callback = function () {};
      });

      it("should return self", function () {
        var result = classBuilder.forwardBlend(Mixin, callback);
        expect(result).toBe(classBuilder);
      });

      it("should add mixin to forwards", function () {
        classBuilder.forwardBlend(Mixin, callback);
        expect(classBuilder.forwards).toEqual({
          list: [{
            mixin: mixinBuilder,
            callback: callback
          }],
          lookup: {
            'bar': 1
          }
        });
      });

      describe("when class has mixers", function () {
        var Class,
            mixerBuilder;

        beforeEach(function () {
          Class = classBuilder.build();
          mixerBuilder = $oop.createClass('Mixer')
          .mix(Class);
        });

        it("should add to mixer's forwards", function () {
          classBuilder.forwardBlend(Mixin, callback);
          expect(mixerBuilder.forwards).toEqual({
            list: [{
              mixin: mixinBuilder,
              callback: callback
            }],
            lookup: {
              'bar': 1
            }
          });
        });

        describe("that already mix forward mixin", function () {
          beforeEach(function () {
            mixerBuilder.mix(Mixin);
          });

          it("should not add to mixer's forwards", function () {
            classBuilder.forwardBlend(Mixin, callback);
            expect(mixerBuilder.forwards).toEqual({
              list: [],
              lookup: {}
            });
          });
        });
      });
    });
  });

  describe("createClass()", function () {
    it("should invoke ClassBuilder.create()", function () {
      var classBuilder = {};
      spyOn($oop.ClassBuilder, 'create').and.returnValue(classBuilder);
      var result = $oop.createClass('foo');
      expect($oop.ClassBuilder.create).toHaveBeenCalledWith('foo');
      expect(result).toBe(classBuilder);
    });
  });
});
