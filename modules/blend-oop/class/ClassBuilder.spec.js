"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("ClassBuilder", function () {
    var classBuilder;

    describe("create()", function () {
      describe("on invalid classId", function () {
        it("should throw", function () {
          expect(function () {
            $oop.ClassBuilder.create();
          }).toThrow();
        });
      });

      it("should create ClassBuilder instance", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect($oop.ClassBuilder.isPrototypeOf(classBuilder)).toBeTruthy();
      });

      it("should initialize classId", function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        expect(classBuilder.classId).toBe('foo');
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

      it("should add Mixin builder to mixins", function () {
        Mixin = mixinBuilder.build();
        classBuilder.mix(Mixin);
        expect(classBuilder.mixins.downstream).toEqual({
          list: [mixinBuilder],
          lookup: {
            bar: 1
          }
        });
      });

      it("should add self to Mixin's mixers", function () {
        Mixin = mixinBuilder.build();
        classBuilder.mix(Mixin);
        expect(mixinBuilder.mixins.upstream).toEqual({
          list: [classBuilder],
          lookup: {
            foo: 1
          }
        });
      });

      describe("when Mixin has expectations", function () {
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

      describe("when Mixin has mapper", function () {
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

      describe("when mixing again", function () {
        beforeEach(function () {
          Mixin = mixinBuilder.build();
          classBuilder.mix(Mixin);
        });

        it("should not add Mixin to downstream mixins again", function () {
          classBuilder.mix(Mixin);
          expect(classBuilder.mixins.downstream).toEqual({
            list: [mixinBuilder],
            lookup: {
              bar: 1
            }
          });
        });

        it("should not add self to Mixin's upstream mixins again", function () {
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
          klassByClassId;

      beforeEach(function () {
        classBuilder = $oop.ClassBuilder.create('foo');
        klassByClassId = $oop.klassByClassId;
        $oop.klassByClassId = {};
      });

      afterEach(function () {
        $oop.klassByClassId = klassByClassId;
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

      it("should return Klass instance", function () {
        Class = classBuilder.build();
        expect($oop.Klass.isPrototypeOf(Class)).toBeTruthy();
      });

      it("should initialize __builder", function () {
        Class = classBuilder.build();
        expect(Class.__builder).toBe(classBuilder);
      });

      it("should set Class", function () {
        Class = classBuilder.build();
        expect(classBuilder.Class).toBe(Class);
      });

      describe("when Class implements interfaces", function () {
        var interfaceBuilder,
            Interface;

        beforeEach(function () {
          interfaceBuilder = $oop.createClass('Interface')
          .define({
            foo: function () {}
          });
          Interface = interfaceBuilder.build();
          classBuilder.implement(Interface);
        });

        it("should set unimplementedInterfaces", function () {
          Class = classBuilder.build();
          expect(classBuilder.unimplementedInterfaces).toEqual([
            interfaceBuilder
          ]);
        });
      });

      describe("when Class has expectations", function () {
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

      it("should store class in klassByClassId", function () {
        Class = classBuilder.build();
        expect($oop.klassByClassId).toEqual({
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
