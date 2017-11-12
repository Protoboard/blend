"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'];

describe("$oop", function () {
  describe("Class", function () {
    var classByClassId,
        classByMixinIds,
        Class,
        result;

    beforeEach(function () {
      classByClassId = $oop.classByClassId;
      classByMixinIds = $oop.classByMixinIds;
      $oop.classByClassId = {};
      $oop.classByMixinIds = {};
      Class = $oop.getClass('Class');
    });

    afterEach(function () {
      $oop.classByClassId = classByClassId;
      $oop.classByMixinIds = classByMixinIds;
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
          .mix($oop.getClass('Mixin')
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

    describe("mix()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin')
        .define({
          foo: "FOO",
          bar: function () {}
        });
      });

      describe("when passing no arguments", function () {
        it("should throw", function () {
          expect(function () {
            Class.mix();
          }).toThrow();
        });
      });

      it("should return self", function () {
        result = Class.mix(Mixin);
        expect(result).toBe(Class);
      });

      it("should add to mixins", function () {
        Class.mix(Mixin);
        expect(Class.__mixins.downstream).toEqual({
          list: [Mixin],
          lookup: {
            'test.$oop.Class.Mixin': 1
          }
        });
      });

      it("should add self to includers on remote class", function () {
        Class.mix(Mixin);
        expect(Mixin.__mixins.upstream).toEqual({
          list: [Class],
          lookup: {
            Class: 1
          }
        });
      });

      it("should add to list of contributions", function () {
        Class.mix(Mixin);
        expect(Class.__contributors).toEqual({
          list: [Mixin],
          lookup: {
            'test.$oop.Class.Mixin': 0
          }
        });
      });

      describe("when mixing the same mixin again", function () {
        beforeEach(function () {
          Class.mix(Mixin);
        });

        it("should not add to contributions again", function () {
          Class.mix(Mixin);
          expect(Class.__contributors).toEqual({
            list: [Mixin],
            lookup: {
              'test.$oop.Class.Mixin': 0
            }
          });
        });
      });

      it("should add methods to __methodMatrix", function () {
        Class.mix(Mixin);
        expect(Class.__methodMatrix).toEqual({
          bar: [Mixin.__members.bar]
        });
      });

      it("should add properties to __propertyMatrix", function () {
        Class.mix(Mixin);
        expect(Class.__propertyMatrix).toEqual({
          foo: [Mixin.__members.foo]
        });
      });

      it("should re-calculate properties on class", function () {
        Class.mix(Mixin);
        expect(Class.foo).toBe("FOO");
      });

      it("should add methods to class", function () {
        Class.mix(Mixin);
        expect(Class.bar).toBe(Mixin.__members.bar);
      });

      describe("when class has more than 1 mixin", function () {
        var Mixin2;

        beforeEach(function () {
          Mixin2 = $oop.getClass('test.$oop.Class.Mixin2');
        });

        it("should add class to classByMixinIds", function () {
          Class
          .mix(Mixin)
          .mix(Mixin2);
          expect($oop.classByMixinIds).toEqual({
            'test.$oop.Class.Mixin,test.$oop.Class.Mixin2': {
              list: [Class],
              lookup: {
                'Class': 0
              }
            }
          });
        });
      });

      describe("then implementing relevant interface", function () {
        beforeEach(function () {
          Class.mix(Mixin);
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
          Class.mix(Mixin);
          Class.expect(Mixin);
        });

        it("should not add class to expected mixins", function () {
          expect(Class.__expected.downstream).toEqual({
            list: [],
            lookup: {}
          });
        });
      });

      describe("when mixin has expectations or mixins", function () {
        var Expected2, Expected3, Mixin1;

        beforeEach(function () {
          Class.expect(Expected2 = $oop.getClass('test.$oop.Class.Expected2')
          .mix(Mixin1 = $oop.getClass('test.$oop.Class.Mixin1')));

          Mixin1.expect(Expected3 = $oop.getClass('test.$oop.Class.Expected3'));
        });

        it("should transfer expected mixins", function () {
          Class.mix(Mixin);
          expect(Class.__expected.downstream).toEqual({
            list: [Expected2, Mixin1, Expected3],
            lookup: {
              'test.$oop.Class.Mixin1': Mixin1,
              'test.$oop.Class.Expected2': Expected2,
              'test.$oop.Class.Expected3': Expected3
            }
          });
        });
      });

      describe("when mixin has forwards", function () {
        var ForwardMixin,
            filter;

        beforeEach(function () {
          ForwardMixin = $oop.getClass('test.$oop.Class.ForwardMixin');
          filter = function () {};
          Mixin.forwardBlend(ForwardMixin, filter);
        });

        it("should transfer forwards from mixin", function () {
          Class.mix(Mixin);
          expect(Class.__forwards).toEqual({
            list: [{
              mixin: ForwardMixin,
              filter: filter,
              source: Mixin
            }],
            sources: [Mixin],
            lookup: {
              'test.$oop.Class.ForwardMixin,test.$oop.Class.Mixin': 0
            }
          });
        });

        describe("when current class also has forwards", function () {
          var ForwardMixin2;

          beforeEach(function () {
            ForwardMixin2 = $oop.getClass('test.$oop.Class.ForwardMixin2');
            Class.forwardBlend(ForwardMixin2, filter);
          });

          it("should transfer mixin's forwards before own", function () {
            Class.mix(Mixin);
            expect(Class.__forwards).toEqual({
              list: [{
                mixin: ForwardMixin,
                filter: filter,
                source: Mixin
              }, {
                mixin: ForwardMixin2,
                filter: filter,
                source: Class
              }],
              sources: [Mixin, Class],
              lookup: {
                'test.$oop.Class.ForwardMixin,test.$oop.Class.Mixin': 0,
                'test.$oop.Class.ForwardMixin2,Class': 1
              }
            });
          });

          it("should remove forwards that are or are mixed by the mixin", function () {
            Mixin.blend(ForwardMixin2);
            Class.mix(Mixin);
            expect(Class.__forwards).toEqual({
              list: [{
                mixin: ForwardMixin,
                filter: filter,
                source: Mixin
              }],
              sources: [Mixin],
              lookup: {
                'test.$oop.Class.ForwardMixin,test.$oop.Class.Mixin': 0
              }
            });
          });
        });

        describe("when forward is mixed by current class", function () {
          var ForwardMixin2;

          beforeEach(function () {
            ForwardMixin2 = $oop.getClass('test.$oop.Class.ForwardMixin2');
            Class.mix(ForwardMixin2);
            Mixin.forwardBlend(ForwardMixin2, filter);
          });

          it("should not transfer mixed forward", function () {
            Class.mix(Mixin);
            expect(Class.__forwards).toEqual({
              list: [{
                mixin: ForwardMixin,
                filter: filter,
                source: Mixin
              }],
              sources: [Mixin],
              lookup: {
                'test.$oop.Class.ForwardMixin,test.$oop.Class.Mixin': 0
              }
            });
          });
        });
      });

      describe("then defining members on mixins", function () {
        beforeEach(function () {
          Class.mix(Mixin);
          Mixin.define({
            bar: function () {},
            baz: function () {},
            foo: "BAR",
            quux: "QUUX"
          });
        });

        it("should add new methods to __methodMatrix", function () {
          expect(Class.__methodMatrix).toEqual({
            bar: [Mixin.__members.bar],
            baz: [Mixin.__members.baz]
          });
        });

        it("should add new properties to __propertyMatrix", function () {
          expect(Class.__propertyMatrix).toEqual({
            foo: [Mixin.__members.foo],
            quux: [Mixin.__members.quux]
          });
        });

        it("should re-calculate properties on class", function () {
          expect(Class.foo).toBe("BAR");
          expect(Class.quux).toBe("QUUX");
        });

        it("should replace methods on class", function () {
          expect(Class.bar).toBe(Mixin.__members.bar);
        });

        it("should replace methods on class", function () {
          expect(Class.baz).toBe(Mixin.__members.baz);
        });
      });

      describe("then defining methods on class", function () {
        var batch;

        beforeEach(function () {
          Class.mix(Mixin);
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

      describe("then setting mapper on mixin", function () {
        var mapper;

        beforeEach(function () {
          Class.mix(Mixin);
          mapper = function () {};
          Mixin.cacheBy(mapper);
        });

        it("should transfer mapper to blender", function () {
          expect(Class.__mapper).toBe(mapper);
        });
      });
    });

    describe("mixWhen()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin');
        spyOn(Class, 'mix');
      });

      it("should return self", function () {
        var result = Class.mixWhen(Mixin, function () {});
        expect(result).toBe(Class);
      });

      describe("when callback returns truthy", function () {
        it("should mix class", function () {
          Class.mixWhen(Mixin, function () {return true;});
          expect(Class.mix).toHaveBeenCalledWith(Mixin);
        });
      });

      describe("when callback returns falsy", function () {
        it("should not mix class", function () {
          Class.mixWhen(Mixin, function () {return false;});
          expect(Class.mix).not.toHaveBeenCalledWith(Mixin);
        });
      });
    });

    describe("blend()", function () {
      var Mixin1,
          Mixin2;

      beforeEach(function () {
        Mixin1 = $oop.getClass("test.$oop.Class.Mixin1")
        .define({
          BAR: "BAR",
          bar: function () {}
        });
        Mixin2 = $oop.getClass("test.$oop.Class.Mixin2")
        .mix(Mixin1)
        .define({
          BAZ: "BAZ",
          baz: function () {}
        });
      });

      it("should add all dependencies", function () {
        Class
        .blend(Mixin2)
        .define({
          BAR: "QUUX",
          foo: function () {}
        });

        expect(Class.__contributors.list).toEqual([
          Mixin1, Mixin2, Class
        ]);
      });

      it("should add class to blenders", function () {
        Class
        .blend(Mixin2)
        .define({
          BAR: "QUUX",
          foo: function () {}
        });

        expect(Mixin1.__blenders.list).toEqual([Class]);
        expect(Mixin2.__blenders.list).toEqual([Class]);
      });

      describe("then mixing a class", function () {
        var Mixin3,
            Mixin4;

        beforeEach(function () {
          Mixin3 = $oop.getClass("test.$oop.Class.Mixin3")
          .define({
            QUUX: "QUUX",
            quux: function () {}
          });
          Mixin4 = $oop.getClass("test.$oop.Class.Mixin4")
          .define({
            FOO: "FOO",
            foo: function () {}
          });

          Class
          .blend(Mixin2)
          .define({
            BAR: "QUUX",
            foo: function () {}
          });
        });

        it("should propagate to blenders", function () {
          Mixin1
          .mix(Mixin3)
          .mix(Mixin4);
          expect(Class.__mixins.downstream.list).toEqual([
            Mixin1, Mixin2, Mixin3, Mixin4
          ]);
          expect(Class.__contributors).toEqual({
            list: [Mixin3, Mixin4, Mixin1, Mixin2, Class],
            lookup: {
              'test.$oop.Class.Mixin3': 0,
              'test.$oop.Class.Mixin4': 1,
              'test.$oop.Class.Mixin1': 2,
              'test.$oop.Class.Mixin2': 3,
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

      describe("when 2nd-degree mixin blends mixins", function () {
        var Mixin1st,
            Mixin2nd,
            Mixin3rd;

        beforeEach(function () {
          Mixin1st = $oop.getClass('test.$oop.Class.Mixin1st');
          Mixin2nd = $oop.getClass('test.$oop.Class.Mixin2nd');
          Mixin3rd = $oop.getClass('test.$oop.Class.Mixin3rd');
          Mixin1st.blend(Mixin2nd);
          Class.blend(Mixin1st);
        });

        it("should mix 3rd-degree mixins before 2nd", function () {
          Mixin2nd.blend(Mixin3rd);
          expect(Class.__contributors.list).toEqual([
            Mixin3rd, Mixin2nd, Mixin1st
          ]);
        });
      });
    });

    describe("blendWhen()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin');
        spyOn(Class, 'blend');
      });

      it("should return self", function () {
        var result = Class.blendWhen(Mixin, function () {});
        expect(result).toBe(Class);
      });

      describe("when callback returns truthy", function () {
        it("should blend class", function () {
          Class.blendWhen(Mixin, function () {return true;});
          expect(Class.blend).toHaveBeenCalledWith(Mixin);
        });
      });

      describe("when callback returns falsy", function () {
        it("should not blend class", function () {
          Class.blendWhen(Mixin, function () {return false;});
          expect(Class.blend).not.toHaveBeenCalledWith(Mixin);
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
          Class.mix(Expected);
        });

        it("should remove class from expected mixins", function () {
          expect(Class.__expected.downstream).toEqual({
            list: [],
            lookup: {}
          });
        });
      });

      describe("when expected mixin has mixins (present or expected)", function () {
        var Expected2, Expected3, Mixin;

        beforeEach(function () {
          Class.expect(Expected2 = $oop.getClass('Expected2')
          .expect(Expected3 = $oop.getClass('Expected3')));

          Expected2.mix(Mixin = $oop.getClass('Mixin'));
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

    describe("forwardBlend()", function () {
      var ForwardMixin,
          filter;

      beforeEach(function () {
        ForwardMixin = $oop.getClass('test.$oop.Class.ForwardMixin');
        filter = function () {};
      });

      it("should return self", function () {
        result = Class.forwardBlend(ForwardMixin, filter);
        expect(result).toBe(Class);
      });

      it("should add forward descriptor", function () {
        Class.forwardBlend(ForwardMixin, filter);
        expect(Class.__forwards).toEqual({
          list: [{
            mixin: ForwardMixin,
            filter: filter,
            source: Class
          }],
          sources: [Class],
          lookup: {
            'test.$oop.Class.ForwardMixin,Class': 0
          }
        });
      });

      describe("when passing invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.forwardBlend(null, filter);
          }).toThrow();
        });
      });

      describe("when class has mixers", function () {
        var Mixer1, Mixer2;

        beforeEach(function () {
          Mixer1 = $oop.getClass('test.$oop.Class.Mixer1')
          .mix(Class);
          Mixer2 = $oop.getClass('test.$oop.Class.Mixer2')
          .mix(Class);
        });

        it("should propagate forwards to mixers", function () {
          Class.forwardBlend(ForwardMixin, filter);
          expect(Mixer1.__forwards).toEqual({
            list: [{
              mixin: ForwardMixin,
              filter: filter,
              source: Class
            }],
            sources: [Class],
            lookup: {
              'test.$oop.Class.ForwardMixin,Class': 0
            }
          });
          expect(Mixer2.__forwards).toEqual({
            list: [{
              mixin: ForwardMixin,
              filter: filter,
              source: Class
            }],
            sources: [Class],
            lookup: {
              'test.$oop.Class.ForwardMixin,Class': 0
            }
          });
        });

        describe("when forward is mixed by mixers", function () {
          var ForwardMixin;

          beforeEach(function () {
            ForwardMixin = $oop.getClass('test.$oop.Class.ForwardMixin');
            Mixer2.mix(ForwardMixin);
          });

          it("should not propagate forwards to mixers", function () {
            Class.forwardBlend(ForwardMixin, filter);
            expect(Mixer1.__forwards).toEqual({
              list: [{
                mixin: ForwardMixin,
                filter: filter,
                source: Class
              }],
              sources: [Class],
              lookup: {
                'test.$oop.Class.ForwardMixin,Class': 0
              }
            });
            expect(Mixer2.__forwards).toEqual({
              list: [],
              sources: [],
              lookup: {}
            });
          });
        });
      });

      describe("when forward is already added for mixin", function () {
        var filter2;

        beforeEach(function () {
          Class.forwardBlend(ForwardMixin, filter);
          filter2 = function () {};
        });

        it("should do nothing filter", function () {
          Class.forwardBlend(ForwardMixin, filter2);
          expect(Class.__forwards).toEqual({
            list: [{
              mixin: ForwardMixin,
              filter: filter,
              source: Class
            }],
            sources: [Class],
            lookup: {
              'test.$oop.Class.ForwardMixin,Class': 0
            }
          });
        });
      });

      describe("then mixing to another class", function () {
        var Mixer;

        beforeEach(function () {
          Class.forwardBlend(ForwardMixin, filter);
          Mixer = $oop.getClass('test.$oop.Class.Mixer');
        });

        it("should transfer forwards", function () {
          Mixer.mix(Class);
          expect(Mixer.__forwards.list).toContain({
            mixin: ForwardMixin,
            filter: filter,
            source: Class
          });
          expect(Mixer.__forwards.sources).toContain(Class);
          expect(Mixer.__forwards.lookup['test.$oop.Class.ForwardMixin,Class'])
          .toBeDefined();
        });
      });
    });

    describe("cacheBy()", function () {
      var mapper;

      beforeEach(function () {
        mapper = function () {
        };
        result = Class.cacheBy(mapper);
      });

      describe("when passing invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Class.cacheBy();
          }).toThrow();
        });
      });

      it("should return self", function () {
        expect(result).toBe(Class);
      });

      it("should set mapper function", function () {
        expect(Class.__mapper).toBe(mapper);
      });

      describe("then mix()", function () {
        var Mixer;

        beforeEach(function () {
          Mixer = $oop.getClass("test.$oop.Class.Mixer")
          .blend(Class);
        });

        it("should transfer mapper to blender", function () {
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

    describe("implementedBy()", function () {
      var Interface;

      beforeEach(function () {
        Interface = $oop.getClass('Interface');
        Class.implement(Interface);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Interface.implementedBy(undefined)).toBe(false);
        });
      });

      describe("on implementing class", function () {
        it("should return true", function () {
          expect(Interface.implementedBy(Class)).toBe(true);
        });
      });

      describe("on non-implementing class", function () {
        it("should return false", function () {
          var Class2 = $oop.getClass('Class2');
          expect(Interface.implementedBy(Class2)).toBe(false);
        });
      });
    });

    describe("mixes()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin');
        Class.mix(Mixin);
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
          expect(Class.mixes(Mixin)).toBe(true);
        });
      });

      describe("on absent mixin", function () {
        it("should return false", function () {
          var Mixin2 = $oop.getClass('test.$oop.Class.Mixin2');
          expect(Class.mixes(Mixin2)).toBe(false);
        });
      });
    });

    describe("mixedBy()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin');
        Class.mix(Mixin);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Mixin.mixedBy(undefined)).toBe(false);
        });
      });

      describe("on mixing class", function () {
        it("should return true", function () {
          expect(Mixin.mixedBy(Class)).toBe(true);
        });
      });

      describe("on non-mixing class", function () {
        it("should return false", function () {
          var Class2 = $oop.getClass('Class2');
          expect(Mixin.mixedBy(Class2)).toBe(false);
        });
      });
    });

    describe("expects()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin')
        .expect(Class);
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            Mixin.expects();
          }).toThrow();
        });
      });

      describe("on fulfilled expectation", function () {
        it("should return true", function () {
          expect(Mixin.expects(Class)).toBe(true);
        });
      });

      describe("on unfulfilled expectation", function () {
        it("should return false", function () {
          var Mixin2 = $oop.getClass('test.$oop.Class.Mixin2');
          expect(Mixin2.expects(Class)).toBe(false);
        });
      });
    });

    describe("expectedBy()", function () {
      var Mixin;

      beforeEach(function () {
        Mixin = $oop.getClass('test.$oop.Class.Mixin')
        .expect(Class);
      });

      describe("when passing non-class", function () {
        it("should return false", function () {
          expect(Mixin.expectedBy(undefined)).toBe(false);
        });
      });

      describe("on fulfilled expectation", function () {
        it("should return true", function () {
          expect(Class.expectedBy(Mixin)).toBe(true);
        });
      });

      describe("on non-mixing class", function () {
        it("should return false", function () {
          var Mixin2 = $oop.getClass('test.$oop.Class.Mixin2');
          expect(Class.expectedBy(Mixin2)).toBe(false);
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
            args;

        beforeEach(function () {
          args = {};
          defaults = jasmine.createSpy();
          Class.define({
            defaults: defaults
          });

          Class.create(args);
        });

        it("should invoke defaults", function () {
          expect(defaults).toHaveBeenCalledWith();
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

      describe("of mixin", function () {
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
          Class.cacheBy(function (args) {
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
          .mix(Class);

          $oop.getClass('Class')
          .forwardBlend(Forward, function (args) {
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
            .cacheBy(function (args) {
              return '_' + args.foo;
            })
            .mix(Class);

            $oop.getClass('Class')
            .forwardBlend(Forward2, function (args) {
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

  describe("isInstanceOf()", function () {
    var Class,
        instance;

    beforeEach(function () {
      Class = $oop.getClass('test.$assert.isInstanceOf.Class');
      instance = Class.create();
      spyOn($assert, 'assert').and.callThrough();
    });

    it("should pass message to assert", function () {
      $assert.isInstanceOf(instance, Class, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-instance", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isInstanceOf(undefined, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOf(null, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOf(1, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOf({}, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOf($oop.getClass('test.$assert.isInstanceOf.Class2'), Class);
        }).toThrow();
      });
    });
  });

  describe("isInstanceOfOptional()", function () {
    var Class,
        instance;

    beforeEach(function () {
      Class = $oop.getClass('test.$assert.isInstanceOf.Class');
      instance = Class.create();
      spyOn($assert, 'assert').and.callThrough();
    });

    it("should pass message to assert", function () {
      $assert.isInstanceOfOptional(undefined, Class, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-instance", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isInstanceOfOptional(null, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOfOptional(1, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOfOptional({}, Class);
        }).toThrow();
        expect(function () {
          $assert.isInstanceOfOptional($oop.getClass('test.$assert.isInstanceOf.Class2'), Class);
        }).toThrow();
      });
    });
  });
});