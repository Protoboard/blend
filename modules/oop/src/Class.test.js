describe("Class", function () {
    "use strict";

    var builder,
        Class;

    beforeEach(function () {
        $oop.ClassBuilder.builders = {};
        $oop.ClassBuilder.classes = {};
        builder = $oop.ClassBuilder.create('Class');
    });

    describe("instantiation", function () {
        describe("of trait", function () {
            var Require1;

            beforeEach(function () {
                Require1 = $oop.ClassBuilder.create('Require1')
                    .build();
                Class = builder
                    .require(Require1)
                    .build();
            });

            it("should throw", function () {
                expect(function () {
                    Class.create();
                }).toThrow();
            });
        });

        describe("of cached class", function () {
            var Class,
                instance;

            beforeEach(function () {
                Class = builder
                    .cache(function (foo) {
                        return '_' + foo;
                    })
                    .build();
            });

            describe("when instance is not cached yet", function () {
                it("should store new instance in cache", function () {
                    expect(Class.__instances).toEqual({});
                    instance = Class.create('foo');
                    expect(Class.__instances).toEqual({
                        '_foo': instance
                    });
                });
            });

            describe("when instance is already cached", function () {
                var cached;

                beforeEach(function () {
                    Class.create('foo');
                    cached = Class.__instances['_foo'];
                });

                it("should return cached instance", function () {
                    instance = Class.create('foo');
                    expect(instance).toBe(cached);
                });
            });
        });

        describe("of forwarded class", function () {
            var Forward,
                result;

            beforeEach(function () {
                Class = builder
                    .define({
                        foo: function () {
                            return 'foo';
                        }
                    })
                    .build();

                Forward = $oop.ClassBuilder.create('Forward')
                    .include(Class)
                    .build();

                $oop.ClassBuilder.create('Class')
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
                    Forward2 = $oop.ClassBuilder.create('Forward2')
                        .cache(function (foo) {
                            return '_' + foo;
                        })
                        .include(Class)
                        .build();

                    $oop.ClassBuilder.create('Class')
                        .forward(Forward2, function (foo) {
                            return foo === 2;
                        });
                });

                it("should return cached forward instance", function () {
                    result = Class.create(2);
                    expect(result).toBe(Forward2.__instances._2);
                });
            });
        });
    });

    describe("implementation tester", function () {
        var Interface,
            Class,
            instance;

        beforeEach(function () {
            Interface = $oop.ClassBuilder.create('Interface')
                .build();
            Class = builder
                .implement(Interface)
                .build();
            instance = Class.create();
        });

        describe("on invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    instance.implements();
                }).toThrow();
            });
        });

        describe("on present interface", function () {
            it("should return true", function () {
                expect(instance.implements(Interface)).toBe(true);
            });
        });

        describe("on absent interface", function () {
            it("should return false", function () {
                var Interface2 = $oop.ClassBuilder.create('Interface2').build();
                expect(instance.implements(Interface2)).toBe(false);
            });
        });
    });

    describe("inclusion tester", function () {
        var Trait,
            Class,
            instance;

        beforeEach(function () {
            Trait = $oop.ClassBuilder.create('Trait')
                .build();
            Class = builder
                .include(Trait)
                .build();
            instance = Class.create();
        });

        describe("on invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    instance.includes();
                }).toThrow();
            });
        });

        describe("on self", function () {
            it("should return true", function () {
                expect(Class.includes(Class)).toBe(true);
                expect(instance.includes(Class)).toBe(true);
            });
        });

        describe("on present include", function () {
            it("should return true", function () {
                expect(instance.includes(Trait)).toBe(true);
            });
        });

        describe("on absent include", function () {
            it("should return false", function () {
                var Trait2 = $oop.ClassBuilder.create('Trait2').build();
                expect(instance.includes(Trait2)).toBe(false);
            });
        });
    });

    describe("require tester", function () {
        var Host,
            Class;

        beforeEach(function () {
            Host = $oop.ClassBuilder.create('Host')
                .build();
            Class = builder
                .require(Host)
                .build();
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
                var Host2 = $oop.ClassBuilder.create('Host2').build();
                expect(Class.requires(Host2)).toBe(false);
            });
        });
    });
});
