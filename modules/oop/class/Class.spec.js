"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'];

describe("$oop", function () {
  describe("Class", function () {
    var Class,
        result;

    beforeEach(function () {
      $oop.Class.classByClassId = {};
      Class = $oop.Class.getClass('Class');
    });

    describe("getClass()", function () {
      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            $oop.Class.getClass();
          }).toThrow();
        });
      });

      describe("when class already created", function () {
        beforeEach(function () {
          result = $oop.Class.getClass('Class');
        });

        it("should return same class", function () {
          expect(result).toBe(Class);
        });
      });

      it("should set class ID", function () {
        expect(result.__classId).toEqual('Class');
      });

      it("should initialize member container", function () {
        expect(result.__members).toEqual({});
      });

      it("should initialize interfaces", function () {
        expect(result.__interfaces).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize mixins", function () {
        expect(result.__mixins).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize expected", function () {
        expect(result.__expected).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize contributors", function () {
        expect(result.__contributors).toEqual({list: [], lookup: {}});
      });

      it("should initialize method matrix", function () {
        expect(result.__methodMatrix).toEqual({});
      });

      it("should initialize missing method names", function () {
        expect(result.__missingMethodNames)
        .toEqual({list: [], lookup: {}});
      });

      it("should initialize forwards", function () {
        expect(result.__forwards).toEqual([]);
      });

      it("should initialize hash function", function () {
        expect(result.__mapper).toBeUndefined();
      });

      it("should initialize instance lookup", function () {
        expect(result.__instanceLookup).toEqual({});
      });
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
            $oop.Class.getClass('Class2').define();
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

      it("should add methods to method matrix", function () {
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
              baz: $oop.Class.getClass('Test').create()
            });
          }).toThrow();
        });
      });

      describe("some of which are classes", function () {
        it("should not throw", function () {
          expect(function () {
            Class.define({
              baz: $oop.Class.getClass('Test')
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

      // todo Test if wrappers actually work
      it("should add wrapper methods", function () {
        expect(typeof Class.bar === 'function').toBeTruthy();
        expect(Class.bar).not.toBe(batch.bar);
      });

      describe("then implementing relevant interface", function () {
        beforeEach(function () {
          Class.implement($oop.Class.getClass('Interface')
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
        Interface = $oop.Class.getClass('Interface')
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
          Class.implement($oop.Class.getClass('Interface2')
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

      describe("then including same class", function () {
        beforeEach(function () {
          Class
          .implement($oop.Class.getClass('Interface2')
          .define({
            baz: function () {
            }
          }))
          .mixOnly($oop.Class.getClass('Mixin')
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
            $oop.Class.getClass('Mixin')
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
        Trait = $oop.Class.getClass('Trait')
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

      it("should add methods to method matrix", function () {
        expect(Class.__methodMatrix).toEqual({
          bar: [Trait.__members.bar]
        });
      });

      it("should copy properties to class", function () {
        expect(Class.foo).toBe("FOO");
      });

      it("should add wrapper methods", function () {
        expect(typeof Class.bar === 'function').toBeTruthy();
        expect(Class.bar).not.toBe(Trait.__members.bar);
      });

      describe("then implementing relevant interface", function () {
        beforeEach(function () {
          Class.implement($oop.Class.getClass('Interface')
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
          Class.expect(Expected2 = $oop.Class.getClass('Expected2')
          .mixOnly(Mixin = $oop.Class.getClass('Mixin')));

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
            baz: function () {},
            quux: "QUUX"
          });
        });

        it("should add new methods to method matrix", function () {
          expect(Class.__methodMatrix).toEqual({
            bar: [Trait.__members.bar],
            baz: [Trait.__members.baz]
          });
        });

        it("should add new properties to class", function () {
          expect(Class.quux).toBe("QUUX");
        });

        it("should add new wrapper methods", function () {
          expect(typeof Class.baz === 'function').toBeTruthy();
          expect(Class.baz).not.toBe(Trait.__members.baz);
        });
      });

      describe("including multiple classes", function () {
        var A, B, C, D;

        beforeEach(function () {
          A = $oop.getClass('A');
          B = $oop.getClass('B');
          C = $oop.getClass('C');
          D = $oop.getClass('D');
          D.forward(A, function () {});
          D.forward(B, function () {});
          D.forward(C, function () {});
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
    });

    describe("mix()", function () {
      var Mixin1,
          Mixin2;

      beforeEach(function () {
        Mixin1 = $oop.getClass("Mixin1")
        .define({
          bar: function () {}
        });
        Mixin2 = $oop.getClass("Mixin2")
        .mixOnly(Mixin1)
        .define({
          baz: function () {}
        });

        Class
        .mix(Mixin2)
        .define({
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

      describe("then including a class", function () {
        var Mixin3,
            Mixin4;

        beforeEach(function () {
          Mixin3 = $oop.getClass("Mixin3")
          .define({
            quux: function () {}
          });
          Mixin4 = $oop.getClass("Mixin4")
          .define({
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
        });
      });
    });

    describe("expect()", function () {
      var Expected;

      beforeEach(function () {
        Expected = $oop.Class.getClass('Expected');
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

      describe("then including same class", function () {
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
          Class.expect(Expected2 = $oop.Class.getClass('Expected2')
          .expect(Expected3 = $oop.Class.getClass('Expected3')));

          Expected2.mixOnly(Mixin = $oop.Class.getClass('Mixin'));
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

    describe("forward()", function () {
      var filter, Class1;

      beforeEach(function () {
        filter = function () {
        };
        Class.forward(Class1 = $oop.Class.getClass('Class1'), filter);
      });

      describe("when passing invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.forward(null, filter, 1);
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
          Class2 = $oop.Class.getClass('Class2')
          .mixOnly(Class);
          filter2 = function () {
          };
          Class3 = $oop.Class.getClass('Class3')
          .mixOnly(Class2)
          .mixOnly(Class);
          filter3 = function () {
          };
          Class.forward(Class3, filter3);
          Class.forward(Class2, filter2);
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

      it("should set hash function", function () {
        expect(Class.__mapper).toBe(mapper);
      });
    });

    describe("implements()", function () {
      var Interface;

      beforeEach(function () {
        Interface = $oop.Class.getClass('Interface');
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
          var Interface2 = $oop.Class.getClass('Interface2');
          expect(Class.implements(Interface2)).toBe(false);
        });
      });
    });

    describe("isImplementedBy()", function () {
      var Interface;

      beforeEach(function () {
        Interface = $oop.Class.getClass('Interface');
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
          var Class2 = $oop.Class.getClass('Class2');
          expect(Interface.isImplementedBy(Class2)).toBe(false);
        });
      });
    });

    describe("mixes()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.Class.getClass('Trait');
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
          var Trait2 = $oop.Class.getClass('Trait2');
          expect(Class.mixes(Trait2)).toBe(false);
        });
      });
    });

    describe("mixedBy()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.Class.getClass('Interface');
        Class.mixOnly(Trait);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Trait.mixedBy(undefined)).toBe(false);
        });
      });

      describe("on including class", function () {
        it("should return true", function () {
          expect(Trait.mixedBy(Class)).toBe(true);
        });
      });

      describe("on non-including class", function () {
        it("should return false", function () {
          var Class2 = $oop.Class.getClass('Class2');
          expect(Trait.mixedBy(Class2)).toBe(false);
        });
      });
    });

    describe("create()", function () {
      var instance;

      describe("of trait", function () {
        var Host;

        beforeEach(function () {
          Host = $oop.Class.getClass('Host');
          Class.expect(Host);
        });

        it("should throw", function () {
          expect(function () {
            Class.create();
          }).toThrow();
        });
      });

      describe("of cached class", function () {
        beforeEach(function () {
          Class.cache(function (foo) {
            return '_' + foo;
          });
        });

        describe("when instance is not cached yet", function () {
          it("should store new instance in cache", function () {
            instance = Class.create('foo');
            expect(Class.__instanceLookup).toEqual({
              '_foo': instance
            });
          });
        });

        describe("when instance is already cached", function () {
          var cached;

          beforeEach(function () {
            Class.create('foo');
            cached = Class.__instanceLookup._foo;
          });

          it("should return cached instance", function () {
            instance = Class.create('foo');
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

          Forward = $oop.Class.getClass('Forward')
          .mixOnly(Class);

          $oop.Class.getClass('Class')
          .forward(Forward, function (foo) {
            return foo === 1;
          });
        });

        describe("for matching arguments", function () {
          it("should instantiate forward class", function () {
            result = Class.create(1);
            expect(result.mixes(Class)).toBeTruthy();
            expect(result.mixes(Forward)).toBeTruthy();
          });
        });

        describe("for non-matching arguments", function () {
          it("should instantiate original class", function () {
            result = Class.create(0);
            expect(result.mixes(Class)).toBeTruthy();
            expect(result.mixes(Forward)).toBeFalsy();
          });
        });

        describe("that is also cached", function () {
          var Forward2;

          beforeEach(function () {
            Forward2 = $oop.Class.getClass('Forward2')
            .cache(function (foo) {
              return '_' + foo;
            })
            .mixOnly(Class);

            $oop.Class.getClass('Class')
            .forward(Forward2, function (foo) {
              return foo === 2;
            });
          });

          it("should return cached forward instance", function () {
            result = Class.create(2);
            expect(result).toBe(Forward2.__instanceLookup._2);
          });
        });
      });

      describe("of unimplemented class", function () {
        beforeEach(function () {
          Class.implement($oop.Class.getClass('Interface')
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

      describe("when method name is taken", function () {
        beforeEach(function () {
          instance.foo = "FOO";
        });

        it("should throw", function () {
          expect(function () {
            instance.elevateMethods('foo');
          }).toThrow();
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
  var Class;

  beforeEach(function () {
    $oop.Class.classByClassId = {};
    Class = $oop.Class.getClass('Class');
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