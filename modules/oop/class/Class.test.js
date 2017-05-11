/* global $oop */
"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'];

describe("$oop.Class", function () {
    var Class,
        result;

    beforeEach(function () {
        $oop.Class.classLookup = {};
        Class = $oop.Class.getClass('Class');
    });

    describe("fetching", function () {
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

        it("should initialize method matrix", function () {
            expect(result.__methodMatrix).toEqual({});
        });

        it("should initialize member container", function () {
            expect(result.__members).toEqual({});
        });

        it("should initialize contributors", function () {
            expect(result.__contributors).toEqual([]);
            expect(result.__contributorIndexLookup).toEqual({});
        });

        it("should initialize interfaces", function () {
            expect(result.__interfaces).toEqual([]);
            expect(result.__interfaceLookup).toEqual({});
        });

        it("should initialize implementers", function () {
            expect(result.__implementers).toEqual([]);
            expect(result.__implementerLookup).toEqual({});
        });

        it("should initialize missing method names", function () {
            expect(result.__missingMethodNames).toEqual([]);
            expect(result.__missingMethodLookup).toEqual({});
        });

        it("should initialize includes", function () {
            expect(result.__includes).toEqual([]);
            expect(result.__includeLookup).toEqual({});
        });

        it("should initialize includers", function () {
            expect(result.__includers).toEqual([]);
            expect(result.__includerLookup).toEqual({});
        });

        it("should initialize requires", function () {
            expect(result.__requires).toEqual([]);
            expect(result.__requireLookup).toEqual({});
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

    describe("defining members", function () {
        var batch,
            result;

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
            expect(Class.__contributors).toEqual([Class]);
            expect(Class.__contributorIndexLookup).toEqual({
                Class: 0
            });
        });

        describe("when already in contributions", function () {
            beforeEach(function () {
                Class.define({
                    foo: "BAR"
                });
            });

            it("should not add again", function () {
                expect(Class.__contributors).toEqual([Class]);
                expect(Class.__contributorIndexLookup).toEqual({
                    Class: 0
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

        // TODO: Test if wrappers actually work
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
                expect(Class.__missingMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__missingMethodLookup).toEqual({
                    baz: true
                });
            });
        });
    });

    describe("implementing interface", function () {
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
            expect(Class.__interfaces).toEqual([Interface]);
            expect(Class.__interfaceLookup).toEqual({
                Interface: Interface
            });
        });

        it("should add self to implementers on interface", function () {
            expect(Interface.__implementers).toEqual([Class]);
            expect(Interface.__implementerLookup).toEqual({
                Class: Class
            });
        });

        describe("when already added", function () {
            it("should not add again", function () {
                Class.implement(Interface);
                expect(Class.__interfaces).toEqual([Interface]);
                expect(Class.__interfaceLookup).toEqual({
                    Interface: Interface
                });
            });
        });

        it("should register missing methods", function () {
            expect(Class.__missingMethodNames).toEqual([
                'bar'
            ]);
            expect(Class.__missingMethodLookup).toEqual({
                bar: true
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
                expect(Class.__missingMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__missingMethodLookup).toEqual({
                    baz: true
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
                expect(Class.__missingMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__missingMethodLookup).toEqual({
                    baz: true
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
                    expect(Class.__missingMethodNames).toEqual([]);
                    expect(Class.__missingMethodLookup).toEqual({});
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
                expect(Class.__missingMethodNames).toEqual([
                    'bar', 'baz'
                ]);
                expect(Class.__missingMethodLookup).toEqual({
                    bar: true,
                    baz: true
                });
            });
        });
    });

    describe("including class", function () {
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
            expect(Class.__includes).toEqual([Trait]);
            expect(Class.__includeLookup).toEqual({
                Trait: Trait
            });
        });

        it("should add self to includers on remote class", function () {
            expect(Trait.__includers).toEqual([Class]);
            expect(Trait.__includerLookup).toEqual({
                Class: Class
            });
        });

        it("should add to list of contributions", function () {
            expect(Class.__contributors).toEqual([Trait]);
            expect(Class.__contributorIndexLookup).toEqual({
                Trait: 0
            });
        });

        describe("on duplication", function () {
            beforeEach(function () {
                Class.include(Trait);
            });

            it("should not add to contributions again", function () {
                expect(Class.__contributors).toEqual([Trait]);
                expect(Class.__contributorIndexLookup).toEqual({
                    Trait: 0
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
                expect(Class.__missingMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__missingMethodLookup).toEqual({
                    baz: true
                });
            });
        });

        describe("then requiring same class", function () {
            beforeEach(function () {
                Class.require(Trait);
            });

            it("should not add class to requires", function () {
                expect(Class.__requires).toEqual([]);
                expect(Class.__requireLookup).toEqual({});
            });
        });

        describe("when include has requires or includes", function () {
            var Require2, Require3, Include;

            beforeEach(function () {
                Class.require(Require2 = $oop.Class.getClass('Require2')
                    .include(Include = $oop.Class.getClass('Include'))
                    .require(Require3 = $oop.Class.getClass('Require3')));
            });

            it("should transfer requires", function () {
                expect(Class.__requires).toEqual([
                    Require2, Require3, Include
                ]);
                expect(Class.__requireLookup).toEqual({
                    Include: Include,
                    Require2: Require2,
                    Require3: Require3
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
    });

    describe("requiring class", function () {
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
            expect(Class.__requires).toEqual([Require]);
            expect(Class.__requireLookup).toEqual({
                Require: Require
            });
        });

        describe("then including same class", function () {
            beforeEach(function () {
                Class.include(Require);
            });

            it("should remove class from requires", function () {
                expect(Class.__requires).toEqual([]);
                expect(Class.__requireLookup).toEqual({});
            });
        });

        describe("when require has requires or includes", function () {
            var Require2, Require3, Include;

            beforeEach(function () {
                Class.require(Require2 = $oop.Class.getClass('Require2')
                    .include(Include = $oop.Class.getClass('Include'))
                    .require(Require3 = $oop.Class.getClass('Require3')));
            });

            it("should transfer requires", function () {
                expect(Class.__requires).toEqual([
                    Require, Require2, Require3, Include
                ]);
                expect(Class.__requireLookup).toEqual({
                    Include: Include,
                    Require: Require,
                    Require2: Require2,
                    Require3: Require3
                });
            });
        });
    });

    describe("forwarding", function () {
        var filter, Class1;

        beforeEach(function () {
            filter = function () {
            };
            Class.forward(Class1 = $oop.Class.getClass('Class1'), filter, 1);
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
                'filter': filter,
                'priority': 1
            }]);
        });

        describe("when appending lower priority", function () {
            var Class2,
                filter2;

            beforeEach(function () {
                filter2 = function () {
                };
                Class.forward(Class2 = $oop.Class.getClass('Class2'), filter2, 10);
            });

            it("should sort descriptors by priority", function () {
                expect(Class.__forwards).toEqual([{
                    'class': Class2,
                    'filter': filter2,
                    'priority': 10
                }, {
                    'class': Class1,
                    'filter': filter,
                    'priority': 1
                }]);
            });
        });
    });

    describe("caching", function () {
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

    describe("implementation tester", function () {
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

    describe("reverse implementation tester", function () {
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

    describe("inclusion tester", function () {
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

    describe("reverse inclusion tester", function () {
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

    describe("require tester", function () {
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

    describe("reverse require tester", function () {
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

    describe("instantiation", function () {
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

    describe("method elevation", function () {
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

    describe("class checker", function () {
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

    describe("optional class checker", function () {
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
