"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'];

describe("$oop", function () {
  describe("Class", function () {
    var Class,
        result;

    beforeEach(function () {
      $oop.Class.classLookup = {};
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

      it("should initialize includes", function () {
        expect(result.__includes).toEqual({
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        });
      });

      it("should initialize requires", function () {
        expect(result.__requires).toEqual({
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
          .include($oop.Class.getClass('Include')
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

        describe("then defining members on include", function () {
          beforeEach(function () {
            $oop.Class.getClass('Include')
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

    describe("include()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.Class.getClass('Trait')
        .define({
          foo: "FOO",
          bar: function () {}
        });

        result = Class.include(Trait);
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            Class.include();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add to includes", function () {
        expect(Class.__includes.downstream).toEqual({
          list: [Trait],
          lookup: {
            Trait: 1
          }
        });
      });

      it("should add self to includers on remote class", function () {
        expect(Trait.__includes.upstream).toEqual({
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
          Class.include(Trait);
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
          Class.require(Trait);
        });

        it("should not add class to requires", function () {
          expect(Class.__requires.downstream).toEqual({
            list: [],
            lookup: {}
          });
        });
      });

      describe("when include has requires or includes", function () {
        var Require2, Require3, Include;

        beforeEach(function () {
          Class.require(Require2 = $oop.Class.getClass('Require2')
          .include(Include = $oop.Class.getClass('Include')));

          Include.require(Require3 = $oop.getClass('Require3'));
        });

        it("should transfer requires", function () {
          expect(Class.__requires.downstream).toEqual({
            list: [Require2, Include, Require3],
            lookup: {
              Include: Include,
              Require2: Require2,
              Require3: Require3
            }
          });
        });
      });

      describe("then defining members on include", function () {
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
            A.include(B);
            B.include(C);
            C.include(D);
            B.include(D);
            A.include(C);
            A.include(D);
          });

          it("should set include distances", function () {
            expect(A.__includes.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__includes.upstream.lookup)
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
            A.include(D);
            B.include(D);
            C.include(D);
            A.include(C);
            B.include(C);
            A.include(B);
          });

          it("should set include distances", function () {
            expect(A.__includes.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__includes.upstream.lookup)
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
            A.include(D);
            A.include(C);
            A.include(B);
            B.include(D);
            B.include(C);
            C.include(D);
          });

          it("should set include distances", function () {
            expect(A.__includes.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__includes.upstream.lookup)
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
            A.include(B);
            A.include(D);
            B.include(D);
            A.include(C);
            B.include(C);
            C.include(D);
          });

          it("should set include distances", function () {
            expect(A.__includes.downstream.lookup)
            .toEqual({B: 1, C: 2, D: 3});
            expect(D.__includes.upstream.lookup)
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

    describe("extend()", function () {
      var Include1,
          Include2;

      beforeEach(function () {
        Include1 = $oop.getClass("Include1")
        .define({
          bar: function () {}
        });
        Include2 = $oop.getClass("Include2")
        .include(Include1)
        .define({
          baz: function () {}
        });

        Class
        .extend(Include2)
        .define({
          foo: function () {}
        });
      });

      it("should add all dependencies", function () {
        expect(Class.__contributors.list).toEqual([
          Include1, Include2, Class
        ]);
      });

      it("should add to extenders on includes", function () {
        expect(Include1.__extenders.list).toEqual([Class]);
        expect(Include2.__extenders.list).toEqual([Class]);
      });

      describe("then including a class", function () {
        var Include3,
            Include4;

        beforeEach(function () {
          Include3 = $oop.getClass("Include3")
          .define({
            quux: function () {}
          });
          Include4 = $oop.getClass("Include4")
          .define({
            foo: function () {}
          });
          Include1
          .include(Include3)
          .include(Include4);
        });

        it("should propagate to extenders", function () {
          expect(Class.__includes.downstream.list).toEqual([
            Include1, Include2, Include3, Include4
          ]);
          expect(Class.__contributors).toEqual({
            list: [Include3, Include4, Include1, Include2, Class],
            lookup: {
              Include3: 0,
              Include4: 1,
              Include1: 2,
              Include2: 3,
              Class: 4
            }
          });
          expect(Class.__methodMatrix).toEqual({
            foo: [
              undefined,
              Include4.__members.foo,
              undefined,
              undefined,
              Class.__members.foo
            ],
            bar: [
              undefined,
              undefined,
              Include1.__members.bar
            ],
            baz: [
              undefined,
              undefined,
              undefined,
              Include2.__members.baz
            ],
            quux: [
              Include3.__members.quux
            ]
          });
        });
      });
    });

    describe("require()", function () {
      var Require;

      beforeEach(function () {
        Require = $oop.Class.getClass('Require');
        result = Class.require(Require);
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            Class.require();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should add requires", function () {
        expect(Class.__requires.downstream).toEqual({
          list: [Require],
          lookup: {
            Require: Require
          }
        });
      });

      it("should add self to hosts on remote class", function () {
        expect(Require.__requires.upstream).toEqual({
          list: [Class],
          lookup: {
            Class: Class
          }
        });
      });

      describe("then including same class", function () {
        beforeEach(function () {
          Class.include(Require);
        });

        it("should remove class from requires", function () {
          expect(Class.__requires.downstream).toEqual({
            list: [],
            lookup: {}
          });
        });
      });

      describe("when require has requires or includes", function () {
        var Require2, Require3, Include, Include2;

        beforeEach(function () {
          Class.require(Require2 = $oop.Class.getClass('Require2')
          .require(Require3 = $oop.Class.getClass('Require3')));

          Require2.include(Include = $oop.Class.getClass('Include'));
        });

        it("should transfer requires", function () {
          expect(Class.__requires.downstream).toEqual({
            list: [Require, Require2, Require3, Include],
            lookup: {
              Include: Include,
              Require: Require,
              Require2: Require2,
              Require3: Require3
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
          .include(Class);
          filter2 = function () {
          };
          Class3 = $oop.Class.getClass('Class3')
          .include(Class2)
          .include(Class);
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

    describe("includes()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.Class.getClass('Trait');
        Class.include(Trait);
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.includes();
          }).toThrow();
        });
      });

      describe("on self", function () {
        it("should return true", function () {
          expect(Class.includes(Class)).toBe(true);
        });
      });

      describe("on present include", function () {
        it("should return true", function () {
          expect(Class.includes(Trait)).toBe(true);
        });
      });

      describe("on absent include", function () {
        it("should return false", function () {
          var Trait2 = $oop.Class.getClass('Trait2');
          expect(Class.includes(Trait2)).toBe(false);
        });
      });
    });

    describe("isIncludedBy()", function () {
      var Trait;

      beforeEach(function () {
        Trait = $oop.Class.getClass('Interface');
        Class.include(Trait);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Trait.isIncludedBy(undefined)).toBe(false);
        });
      });

      describe("on including class", function () {
        it("should return true", function () {
          expect(Trait.isIncludedBy(Class)).toBe(true);
        });
      });

      describe("on non-including class", function () {
        it("should return false", function () {
          var Class2 = $oop.Class.getClass('Class2');
          expect(Trait.isIncludedBy(Class2)).toBe(false);
        });
      });
    });

    describe("requires()", function () {
      var Host;

      beforeEach(function () {
        Host = $oop.Class.getClass('Host');
        Class.require(Host);
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.requires();
          }).toThrow();
        });
      });

      describe("on present require", function () {
        it("should return true", function () {
          expect(Class.requires(Host)).toBe(true);
        });
      });

      describe("on absent require", function () {
        it("should return false", function () {
          var Host2 = $oop.Class.getClass('Host2');
          expect(Class.requires(Host2)).toBe(false);
        });
      });
    });

    describe("isRequiredBy()", function () {
      var Host;

      beforeEach(function () {
        Host = $oop.Class.getClass('Interface');
        Class.require(Host);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Host.isRequiredBy(undefined)).toBe(false);
        });
      });

      describe("on requiring class", function () {
        it("should return true", function () {
          expect(Host.isRequiredBy(Class)).toBe(true);
        });
      });

      describe("on non-requiring class", function () {
        it("should return false", function () {
          var Class2 = $oop.Class.getClass('Class2');
          expect(Host.isRequiredBy(Class2)).toBe(false);
        });
      });
    });

    describe("create()", function () {
      var instance;

      describe("of trait", function () {
        var Host;

        beforeEach(function () {
          Host = $oop.Class.getClass('Host');
          Class.require(Host);
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
          .include(Class);

          $oop.Class.getClass('Class')
          .forward(Forward, function (foo) {
            return foo === 1;
          });
        });

        describe("for matching arguments", function () {
          it("should instantiate forward class", function () {
            result = Class.create(1);
            expect(result.includes(Class)).toBeTruthy();
            expect(result.includes(Forward)).toBeTruthy();
          });
        });

        describe("for non-matching arguments", function () {
          it("should instantiate original class", function () {
            result = Class.create(0);
            expect(result.includes(Class)).toBeTruthy();
            expect(result.includes(Forward)).toBeFalsy();
          });
        });

        describe("that is also cached", function () {
          var Forward2;

          beforeEach(function () {
            Forward2 = $oop.Class.getClass('Forward2')
            .cache(function (foo) {
              return '_' + foo;
            })
            .include(Class);

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
    $oop.Class.classLookup = {};
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