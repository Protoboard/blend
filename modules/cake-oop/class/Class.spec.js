"use strict";

var $assert = window['cake-assert'],
    $oop = window['cake-oop'];

describe("$oop", function () {
  describe("Class", function () {
    var classByClassId,
        classByMixinIds,
        mixinsByClassId,
        Class,
        result;

    beforeEach(function () {
      classByClassId = $oop.classByClassId;
      classByMixinIds = $oop.classByMixinIds;
      mixinsByClassId = $oop.mixinsByClassId;
      $oop.classByClassId = {};
      $oop.classByMixinIds = {};
      $oop.mixinsByClassId = {};
      Class = $oop.getClass('Class');
    });

    afterEach(function () {
      $oop.classByClassId = classByClassId;
      $oop.classByMixinIds = classByMixinIds;
      $oop.mixinsByClassId = mixinsByClassId;
    });

    describe("define()", function () {
      var batch;

      beforeEach(function () {
        batch = {
          foo: "FOO",
          bar: function () {
          }
        };
        result = Class.define(batch);
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            $oop.getClass('Class2').define();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add members", function () {
        expect(Class.__members).toEqual({
          foo: "FOO",
          bar: batch.bar
        });
      });

      describe("when member already exists", function () {
        beforeEach(function () {
          Class.define({
            foo: "BAR"
          });
        });

        it("should overwrite members", function () {
          expect(Class.__members).toEqual({
            foo: "BAR",
            bar: batch.bar
          });
        });
      });

      it("should add class to contributions", function () {
        expect(Class.__contributors).toEqual({
          list: [Class],
          lookup: {
            Class: 0
          }
        });
      });

      describe("when already in contributions", function () {
        beforeEach(function () {
          Class.define({
            foo: "BAR"
          });
        });

        it("should not add again", function () {
          expect(Class.__contributors).toEqual({
            list: [Class],
            lookup: {
              Class: 0
            }
          });
        });
      });

      it("should add methods to __methodMatrix", function () {
        expect(Class.__methodMatrix).toEqual({
          bar: [batch.bar]
        });
      });

      describe("on subsequent calls", function () {
        var batch2;

        beforeEach(function () {
          batch2 = {
            baz: function () {
            }
          };
          Class.define(batch2);
        });

        it("should add to the same matrix column", function () {
          expect(Class.__methodMatrix).toEqual({
            bar: [batch.bar],
            baz: [batch2.baz]
          });
        });
      });

      it("should copy properties to class", function () {
        expect(Class.foo).toBe("FOO");
      });

      describe("some of which are instances", function () {
        it("should throw", function () {
          expect(function () {
            Class.define({
              baz: $oop.getClass('Test').create()
            });
          }).toThrow();
        });
      });

      describe("some of which are classes", function () {
        it("should not throw", function () {
          expect(function () {
            Class.define({
              baz: $oop.getClass('Test')
            });
          }).not.toThrow();
        });
      });

      describe("when already added", function () {
        beforeEach(function () {
          Class.define({
            foo: "BAR"
          });
        });

        it("should overwrite properties in class", function () {
          expect(Class.foo).toBe("BAR");
        });
      });

      it("should add methods to class", function () {
        expect(Class.bar).toBe(batch.bar);
      });

      describe("then implementing relevant interface", function () {
        beforeEach(function () {
          Class.implement($oop.getClass('Interface')
          .define({
            bar: function () {
            },
            baz: function () {
            }
          }));
        });

        it("should not register implemented methods", function () {
          expect(Class.__missingMethodNames).toEqual({
            list: ['baz'],
            lookup: {baz: true}
          });
        });
      });

      describe("then delegate()", function () {
        beforeEach(function () {
          batch = {baz: "baz"};
          spyOn(Class, 'define').and.callThrough();
          Class.delegate(batch);
        });

        it("should define delegates", function () {
          expect(Class.define).toHaveBeenCalledWith(batch);
        });
      });
    });

    describe("delegate()", function () {
      var batch;

      beforeEach(function () {
        batch = {
          foo: "FOO",
          bar: function () {
          }
        };
        result = Class.delegate(batch);
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add delegates", function () {
        expect(Class.__delegates).not.toBe(batch);
        expect(Class.__delegates).toEqual(batch);
      });

      describe("then define()", function () {
        beforeEach(function () {
          spyOn(Class, 'define').and.callThrough();
          Class.define({});
        });

        it("should define delegates", function () {
          expect(Class.define.calls.mostRecent().args)
          .toEqual([Class.__delegates]);
        });
      });
    });

    describe("implement()", function () {
      var Interface;

      beforeEach(function () {
        Interface = $oop.getClass('Interface')
        .define({
          foo: "FOO",
          bar: function () {
          }
        });
        result = Class.implement(Interface);
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            Class.implement();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add to interfaces", function () {
        expect(Class.__interfaces.downstream).toEqual({
          list: [Interface],
          lookup: {
            Interface: Interface
          }
        });
      });

      it("should add self to implementers on interface", function () {
        expect(Interface.__interfaces.upstream).toEqual({
          list: [Class],
          lookup: {
            Class: Class
          }
        });
      });

      describe("when already added", function () {
        it("should not add again", function () {
          Class.implement(Interface);
          expect(Class.__interfaces.downstream).toEqual({
            list: [Interface],
            lookup: {
              Interface: Interface
            }
          });
        });
      });

      it("should register missing methods", function () {
        expect(Class.__missingMethodNames).toEqual({
          list: ['bar'],
          lookup: {bar: true}
        });
      });

      describe("then defining relevant methods", function () {
        beforeEach(function () {
          Class.implement($oop.getClass('Interface2')
          .define({
            baz: function () {
            }
          }));

          Class.define({
            bar: function () {
            }
          });
        });

        it("should cancel out missing methods", function () {
          expect(Class.__missingMethodNames).toEqual({
            list: ['baz'],
            lookup: {baz: true}
          });
        });
      });

      describe("then mixing same class", function () {
        beforeEach(function () {
          Class
          .implement($oop.getClass('Interface2')
          .define({
            baz: function () {
            }
          }))
          .mixOnly($oop.getClass('Mixin')
          .define({
            bar: function () {},
            quux: function () {}
          }));
        });

        it("should cancel out missing methods", function () {
          expect(Class.__missingMethodNames).toEqual({
            list: ['baz'],
            lookup: {baz: true}
          });
        });

        describe("then defining members on mixin", function () {
          beforeEach(function () {
            $oop.getClass('Mixin')
            .define({
              baz: function () {}
            });
          });

          it("should cancel out missing methods", function () {
            expect(Class.__missingMethodNames).toEqual({
              list: [],
              lookup: {}
            });
          });
        });
      });

      describe("then defining methods on interface", function () {
        beforeEach(function () {
          Interface.define({
            baz: function () {}
          });
        });

        it("should propagate missing methods", function () {
          expect(Class.__missingMethodNames).toEqual({
            list: ['bar', 'baz'],
            lookup: {
              bar: true,
              baz: true
            }
          });
        });
      });
    });

    describe("mixOnly()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.getClass('Trait')
        .define({
          foo: "FOO",
          bar: function () {}
        });

        result = Class.mixOnly(Trait);
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            Class.mixOnly();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add to mixins", function () {
        expect(Class.__mixins.downstream).toEqual({
          list: [Trait],
          lookup: {
            Trait: 1
          }
        });
      });

      it("should add self to includers on remote class", function () {
        expect(Trait.__mixins.upstream).toEqual({
          list: [Class],
          lookup: {
            Class: 1
          }
        });
      });

      it("should add to list of contributions", function () {
        expect(Class.__contributors).toEqual({
          list: [Trait],
          lookup: {
            Trait: 0
          }
        });
      });

      describe("on duplication", function () {
        beforeEach(function () {
          Class.mixOnly(Trait);
        });

        it("should not add to contributions again", function () {
          expect(Class.__contributors).toEqual({
            list: [Trait],
            lookup: {
              Trait: 0
            }
          });
        });
      });

      it("should add methods to __methodMatrix", function () {
        expect(Class.__methodMatrix).toEqual({
          bar: [Trait.__members.bar]
        });
      });

      it("should add properties to __propertyMatrix", function () {
        expect(Class.__propertyMatrix).toEqual({
          foo: [Trait.__members.foo]
        });
      });

      it("should re-calculate properties on class", function () {
        expect(Class.foo).toBe("FOO");
      });

      it("should add methods to class", function () {
        expect(Class.bar).toBe(Trait.__members.bar);
      });

      it("should add class to classByMixinIds", function () {
        expect($oop.classByMixinIds).toEqual({
          'Trait': {
            list: [Class],
            lookup: {
              'Class': true
            }
          }
        });
      });

      describe("then implementing relevant interface", function () {
        beforeEach(function () {
          Class.implement($oop.getClass('Interface')
          .define({
            bar: function () {
            },
            baz: function () {
            }
          }));
        });

        it("should not register implemented methods", function () {
          expect(Class.__missingMethodNames).toEqual({
            list: ['baz'],
            lookup: {baz: true}
          });
        });
      });

      describe("then requiring same class", function () {
        beforeEach(function () {
          Class.expect(Trait);
        });

        it("should not add class to expected mixins", function () {
          expect(Class.__expected.downstream).toEqual({
            list: [],
            lookup: {}
          });
        });
      });

      describe("when mixin has expectations or mixins", function () {
        var Expected2, Expected3, Mixin;

        beforeEach(function () {
          Class.expect(Expected2 = $oop.getClass('Expected2')
          .mixOnly(Mixin = $oop.getClass('Mixin')));

          Mixin.expect(Expected3 = $oop.getClass('Expected3'));
        });

        it("should transfer expected mixins", function () {
          expect(Class.__expected.downstream).toEqual({
            list: [Expected2, Mixin, Expected3],
            lookup: {
              Mixin: Mixin,
              Expected2: Expected2,
              Expected3: Expected3
            }
          });
        });
      });

      describe("then defining members on mixins", function () {
        beforeEach(function () {
          Trait.define({
            bar: function () {},
            baz: function () {},
            foo: "BAR",
            quux: "QUUX"
          });
        });

        it("should add new methods to __methodMatrix", function () {
          expect(Class.__methodMatrix).toEqual({
            bar: [Trait.__members.bar],
            baz: [Trait.__members.baz]
          });
        });

        it("should add new properties to __propertyMatrix", function () {
          expect(Class.__propertyMatrix).toEqual({
            foo: [Trait.__members.foo],
            quux: [Trait.__members.quux]
          });
        });

        it("should re-calculate properties on class", function () {
          expect(Class.foo).toBe("BAR");
          expect(Class.quux).toBe("QUUX");
        });

        it("should replace methods on class", function () {
          expect(Class.bar).toBe(Trait.__members.bar);
        });

        it("should replace methods on class", function () {
          expect(Class.baz).toBe(Trait.__members.baz);
        });
      });

      describe("then defining methods on class", function () {
        var batch;

        beforeEach(function () {
          batch = {
            bar: function () {}
          };
          Class.define(batch);
        });

        it("should add wrapper methods", function () {
          expect(typeof Class.bar === 'function').toBeTruthy();
          expect(Class.bar).not.toBe(batch.bar);
        });
      });

      describe("mixing multiple classes", function () {
        var A, B, C, D;

        beforeEach(function () {
          A = $oop.getClass('A');
          B = $oop.getClass('B');
          C = $oop.getClass('C');
          D = $oop.getClass('D');
          D.forwardTo(A, function () {});
          D.forwardTo(B, function () {});
          D.forwardTo(C, function () {});
        });

        describe("short paths first", function () {
          beforeEach(function () {
            A.mixOnly(B);
            B.mixOnly(C);
            C.mixOnly(D);
            B.mixOnly(D);
            A.mixOnly(C);
            A.mixOnly(D);
          });

          it("should set mixin distances", function () {
            expect(A.__mixins.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__mixins.upstream.lookup)
            .toEqual({C: 1, B: 2, A: 3});
          });

          it("should update forwards", function () {
            expect(D.__forwards.map(function (forwardDescriptor) {
              return forwardDescriptor.class;
            })).toEqual([D, C, B]);
          });
        });

        describe("long leading paths first", function () {
          beforeEach(function () {
            A.mixOnly(D);
            B.mixOnly(D);
            C.mixOnly(D);
            A.mixOnly(C);
            B.mixOnly(C);
            A.mixOnly(B);
          });

          it("should set mixin distances", function () {
            expect(A.__mixins.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__mixins.upstream.lookup)
            .toEqual({C: 1, B: 2, A: 3});
          });

          it("should update forwards", function () {
            expect(D.__forwards.map(function (forwardDescriptor) {
              return forwardDescriptor.class;
            })).toEqual([D, C, B]);
          });
        });

        describe("long trailing paths first", function () {
          beforeEach(function () {
            A.mixOnly(D);
            A.mixOnly(C);
            A.mixOnly(B);
            B.mixOnly(D);
            B.mixOnly(C);
            C.mixOnly(D);
          });

          it("should set mixin distances", function () {
            expect(A.__mixins.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__mixins.upstream.lookup)
            .toEqual({C: 1, B: 2, A: 3});
          });

          it("should update forwards", function () {
            expect(D.__forwards.map(function (forwardDescriptor) {
              return forwardDescriptor.class;
            })).toEqual([D, C, B]);
          });
        });

        describe("randomly", function () {
          beforeEach(function () {
            A.mixOnly(B);
            A.mixOnly(D);
            B.mixOnly(D);
            A.mixOnly(C);
            B.mixOnly(C);
            C.mixOnly(D);
          });

          it("should set mixin distances", function () {
            expect(A.__mixins.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__mixins.upstream.lookup)
            .toEqual({C: 1, B: 2, A: 3});
          });

          it("should update forwards", function () {
            expect(D.__forwards.map(function (forwardDescriptor) {
              return forwardDescriptor.class;
            })).toEqual([D, C, B]);
          });
        });
      });

      describe("then setting mapper on mixin", function () {
        var mapper;

        beforeEach(function () {
          mapper = function () {};
          Trait.cache(mapper);
        });

        it("should transfer mapper to mixer", function () {
          expect(Class.__mapper).toBe(mapper);
        });
      });
    });

    describe("mix()", function () {
      var Mixin1,
          Mixin2;

      beforeEach(function () {
        Mixin1 = $oop.getClass("Mixin1")
        .define({
          BAR: "BAR",
          bar: function () {}
        });
        Mixin2 = $oop.getClass("Mixin2")
        .mixOnly(Mixin1)
        .define({
          BAZ: "BAZ",
          baz: function () {}
        });

        Class
        .mix(Mixin2)
        .define({
          BAR: "QUUX",
          foo: function () {}
        });
      });

      it("should add all dependencies", function () {
        expect(Class.__contributors.list).toEqual([
          Mixin1, Mixin2, Class
        ]);
      });

      it("should add to transitive mixers to mixins", function () {
        expect(Mixin1.__transitiveMixers.list).toEqual([Class]);
        expect(Mixin2.__transitiveMixers.list).toEqual([Class]);
      });

      describe("then mixing a class", function () {
        var Mixin3,
            Mixin4;

        beforeEach(function () {
          Mixin3 = $oop.getClass("Mixin3")
          .define({
            QUUX: "QUUX",
            quux: function () {}
          });
          Mixin4 = $oop.getClass("Mixin4")
          .define({
            FOO: "FOO",
            foo: function () {}
          });
          Mixin1
          .mixOnly(Mixin3)
          .mixOnly(Mixin4);
        });

        it("should propagate to transitive mixers", function () {
          expect(Class.__mixins.downstream.list).toEqual([
            Mixin1, Mixin2, Mixin3, Mixin4
          ]);
          expect(Class.__contributors).toEqual({
            list: [Mixin3, Mixin4, Mixin1, Mixin2, Class],
            lookup: {
              Mixin3: 0,
              Mixin4: 1,
              Mixin1: 2,
              Mixin2: 3,
              Class: 4
            }
          });
          expect(Class.__methodMatrix).toEqual({
            foo: [
              undefined,
              Mixin4.__members.foo,
              undefined,
              undefined,
              Class.__members.foo
            ],
            bar: [
              undefined,
              undefined,
              Mixin1.__members.bar
            ],
            baz: [
              undefined,
              undefined,
              undefined,
              Mixin2.__members.baz
            ],
            quux: [
              Mixin3.__members.quux
            ]
          });
          expect(Class.__propertyMatrix).toEqual({
            BAR: [
              undefined,
              undefined,
              Mixin1.__members.BAR,
              undefined,
              Class.__members.BAR
            ],
            BAZ: [
              undefined,
              undefined,
              undefined,
              Mixin2.__members.BAZ
            ],
            QUUX: [
              Mixin3.__members.QUUX
            ],
            FOO: [
              undefined,
              Mixin4.__members.FOO
            ]
          });
        });
      });
    });

    describe("expect()", function () {
      var Expected;

      beforeEach(function () {
        Expected = $oop.getClass('Expected');
        result = Class.expect(Expected);
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            Class.expect();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add expects", function () {
        expect(Class.__expected.downstream).toEqual({
          list: [Expected],
          lookup: {
            Expected: Expected
          }
        });
      });

      it("should add self to hosts on remote class", function () {
        expect(Expected.__expected.upstream).toEqual({
          list: [Class],
          lookup: {
            Class: Class
          }
        });
      });

      describe("then mixing same class", function () {
        beforeEach(function () {
          Class.mixOnly(Expected);
        });

        it("should remove class from expected mixins", function () {
          expect(Class.__expected.downstream).toEqual({
            list: [],
            lookup: {}
          });
        });
      });

      describe("when expected mixin has mixins (present or expected)", function () {
        var Expected2, Expected3, Mixin, Mixin2;

        beforeEach(function () {
          Class.expect(Expected2 = $oop.getClass('Expected2')
          .expect(Expected3 = $oop.getClass('Expected3')));

          Expected2.mixOnly(Mixin = $oop.getClass('Mixin'));
        });

        it("should transfer expected mixins", function () {
          expect(Class.__expected.downstream).toEqual({
            list: [Expected, Expected2, Expected3, Mixin],
            lookup: {
              Mixin: Mixin,
              Expected: Expected,
              Expected2: Expected2,
              Expected3: Expected3
            }
          });
        });
      });
    });

    describe("forwardTo()", function () {
      var filter, Class1;

      beforeEach(function () {
        filter = function () {
        };
        Class.forwardTo(Class1 = $oop.getClass('Class1'), filter);
      });

      describe("when passing invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.forwardTo(null, filter, 1);
          }).toThrow();
        });
      });

      it("should add forward descriptor", function () {
        expect(Class.__forwards).toEqual([{
          'class': Class1,
          'filter': filter
        }]);
      });

      describe("when adding more specific class to forwards", function () {
        var Class2, Class3,
            filter2, filter3;

        beforeEach(function () {
          Class2 = $oop.getClass('Class2')
          .mixOnly(Class);
          filter2 = function () {
          };
          Class3 = $oop.getClass('Class3')
          .mixOnly(Class2)
          .mixOnly(Class);
          filter3 = function () {
          };
          Class.forwardTo(Class3, filter3);
          Class.forwardTo(Class2, filter2);
        });

        it("should sort descriptors by class distance", function () {
          expect(Class.__forwards).toEqual([{
            'class': Class3,
            'filter': filter3
          }, {
            'class': Class2,
            'filter': filter2
          }, {
            'class': Class1,
            'filter': filter
          }]);
        });
      });
    });

    describe("cache()", function () {
      var mapper;

      beforeEach(function () {
        mapper = function () {
        };
        result = Class.cache(mapper);
      });

      describe("when passing invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.cache();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should set mapper function", function () {
        expect(Class.__mapper).toBe(mapper);
      });

      describe("then mixOnly()", function () {
        var Mixer;

        beforeEach(function () {
          Mixer = $oop.getClass("test.$oop.Class.Mixer")
          .mix(Class);
        });

        it("should transfer mapper to mixer", function () {
          expect(Mixer.__mapper).toBe(mapper);
        });
      });
    });

    describe("implements()", function () {
      var Interface;

      beforeEach(function () {
        Interface = $oop.getClass('Interface');
        Class.implement(Interface);
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.implements();
          }).toThrow();
        });
      });

      describe("on present interface", function () {
        it("should return true", function () {
          expect(Class.implements(Interface)).toBe(true);
        });
      });

      describe("on absent interface", function () {
        it("should return false", function () {
          var Interface2 = $oop.getClass('Interface2');
          expect(Class.implements(Interface2)).toBe(false);
        });
      });
    });

    describe("isImplementedBy()", function () {
      var Interface;

      beforeEach(function () {
        Interface = $oop.getClass('Interface');
        Class.implement(Interface);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Interface.isImplementedBy(undefined)).toBe(false);
        });
      });

      describe("on implementing class", function () {
        it("should return true", function () {
          expect(Interface.isImplementedBy(Class)).toBe(true);
        });
      });

      describe("on non-implementing class", function () {
        it("should return false", function () {
          var Class2 = $oop.getClass('Class2');
          expect(Interface.isImplementedBy(Class2)).toBe(false);
        });
      });
    });

    describe("mixes()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.getClass('Trait');
        Class.mixOnly(Trait);
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.mixes();
          }).toThrow();
        });
      });

      describe("on self", function () {
        it("should return true", function () {
          expect(Class.mixes(Class)).toBe(true);
        });
      });

      describe("on present mixin", function () {
        it("should return true", function () {
          expect(Class.mixes(Trait)).toBe(true);
        });
      });

      describe("on absent mixin", function () {
        it("should return false", function () {
          var Trait2 = $oop.getClass('Trait2');
          expect(Class.mixes(Trait2)).toBe(false);
        });
      });
    });

    describe("mixedBy()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.getClass('Interface');
        Class.mixOnly(Trait);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Trait.mixedBy(undefined)).toBe(false);
        });
      });

      describe("on mixing class", function () {
        it("should return true", function () {
          expect(Trait.mixedBy(Class)).toBe(true);
        });
      });

      describe("on non-mixing class", function () {
        it("should return false", function () {
          var Class2 = $oop.getClass('Class2');
          expect(Trait.mixedBy(Class2)).toBe(false);
        });
      });
    });

    describe("create()", function () {
      var instance;

      it("should copy properties", function () {
        instance = Class.create({foo: 'FOO', bar: 'BAR'});
        expect(instance.foo).toBe('FOO');
        expect(instance.bar).toBe('BAR');
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.create(null);
          }).toThrow();
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

      describe("when spread is defined", function () {
        var spread,
            args;

        beforeEach(function () {
          args = {};
          spread = jasmine.createSpy();
          Class.define({
            spread: spread
          });

          Class.create(args);
        });

        it("should invoke spread", function () {
          expect(spread).toHaveBeenCalledWith();
        });
      });

      describe("when init is defined", function () {
        var init,
            args;

        beforeEach(function () {
          args = {};
          init = jasmine.createSpy();
          Class.define({
            init: init
          });

          Class.create(args);
        });

        it("should invoke init", function () {
          expect(init).toHaveBeenCalledWith();
        });
      });

      describe("of trait", function () {
        var Host;

        beforeEach(function () {
          Host = $oop.getClass('Host');
          Class.expect(Host);
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
          Class.cache(function (args) {
            context = this;
            return args.foo && // return undefined when args.foo is undefined
                '_' + args.foo; // otherwise a prefixed version of it
          });
        });

        it("should pass class to mapper as context", function () {
          instance = Class.create({foo: 'foo'});
          expect(context).toBe(Class);
        });

        describe("when instance is not cached yet", function () {
          it("should store new instance in cache", function () {
            instance = Class.create({foo: 'foo'});
            expect(Class.__instanceLookup).toEqual({
              '_foo': instance
            });
          });
        });

        describe("when instance does not satisfy mapper", function () {
          it("should not store new instance in cache", function () {
            instance = Class.create({foo: undefined});
            expect(Class.__instanceLookup).toEqual({});
          });
        });

        describe("when instance is already cached", function () {
          var cached;

          beforeEach(function () {
            Class.create({foo: 'foo'});
            cached = Class.__instanceLookup._foo;
          });

          it("should return cached instance", function () {
            instance = Class.create({foo: 'foo'});
            expect(instance).toBe(cached);
          });
        });
      });

      describe("of forwarded class", function () {
        var Forward;

        beforeEach(function () {
          Class.define({
            foo: function () {
              return 'foo';
            }
          });

          Forward = $oop.getClass('Forward')
          .mixOnly(Class);

          $oop.getClass('Class')
          .forwardTo(Forward, function (args) {
            return args.foo === 1;
          });
        });

        describe("for matching arguments", function () {
          it("should instantiate forward class", function () {
            result = Class.create({foo: 1});
            expect(result.mixes(Class)).toBeTruthy();
            expect(result.mixes(Forward)).toBeTruthy();
          });
        });

        describe("for non-matching arguments", function () {
          it("should instantiate original class", function () {
            result = Class.create({foo: 0});
            expect(result.mixes(Class)).toBeTruthy();
            expect(result.mixes(Forward)).toBeFalsy();
          });
        });

        describe("that is also cached", function () {
          var Forward2;

          beforeEach(function () {
            Forward2 = $oop.getClass('Forward2')
            .cache(function (args) {
              return '_' + args.foo;
            })
            .mixOnly(Class);

            $oop.getClass('Class')
            .forwardTo(Forward2, function (args) {
              return args.foo === 2;
            });
          });

          it("should return cached forward instance", function () {
            result = Class.create({foo: 2});
            expect(result).toBe(Forward2.__instanceLookup._2);
          });
        });
      });

      describe("of unimplemented class", function () {
        beforeEach(function () {
          Class.implement($oop.getClass('Interface')
          .define({
            foo: function () {
            }
          }));
        });

        it("should throw", function () {
          expect(function () {
            Class.create();
          }).toThrow();
        });
      });
    });

    describe("elevateMethods()", function () {
      var instance;

      beforeEach(function () {
        Class.define({
          foo: function () {},
          bar: function () {}
        });

        instance = Class.create();
      });

      describe("when not present", function () {
        it("should throw", function () {
          expect(function () {
            instance.elevateMethods('baz');
          }).toThrow();
        });
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

      it("should add elevated method", function () {
        instance.elevateMethods('foo', 'bar');

        expect(instance.hasOwnProperty('foo')).toBeTruthy();
        expect(instance.hasOwnProperty('bar')).toBeTruthy();
        expect(typeof instance.foo).toBe('function');
        expect(instance.foo).not.toBe(Class.foo);
      });
    });
  });
});

describe("$assert", function () {
  var classByClassId,
      Class;

  beforeEach(function () {
    classByClassId = $oop.classByClassId;
    $oop.classByClassId = {};
    Class = $oop.getClass('Class');
  });

  afterEach(function () {
    $oop.classByClassId = classByClassId;
  });

  describe("isClass()", function () {
    beforeEach(function () {
      spyOn($assert, 'assert').and.callThrough();
    });

    it("should pass message to assert", function () {
      $assert.isClass(Class, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing regexp", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.isClass(Class);
        }).not.toThrow();
      });
    });

    describe("when passing non-regexp", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isClass(undefined);
        }).toThrow();
        expect(function () {
          $assert.isClass(null);
        }).toThrow();
        expect(function () {
          $assert.isClass("hello");
        }).toThrow();
        expect(function () {
          $assert.isClass(true);
        }).toThrow();
        expect(function () {
          $assert.isClass(1);
        }).toThrow();
        expect(function () {
          $assert.isClass({});
        }).toThrow();
      });
    });
  });

  describe("isClassOptional()", function () {
    beforeEach(function () {
      spyOn($assert, 'assert').and.callThrough();
    });

    it("should pass message to assert", function () {
      $assert.isClassOptional(Class, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing undefined", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.isClassOptional(undefined);
        }).not.toThrow();
      });
    });
  });
});