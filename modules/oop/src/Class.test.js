describe("Class", function () {
    "use strict";

    var builder,
        Class;

    beforeEach(function () {
        $oop.ClassBuilder.builtClasses = {};
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

        describe("when there are forwards", function () {
            var Forward,
                result;

            beforeEach(function () {
                Class = builder
                    .contribute({
                        foo: function () {
                            return 'foo';
                        }
                    })
                    .build();

                Forward = $oop.ClassBuilder.create('Forward')
                    .extend(Class)
                    .build();

                Class.__builder
                    .forward(Forward, function (foo) {
                        return foo === 1;
                    });
            });

            describe("for matching arguments", function () {
                it("should instantiate forward class", function () {
                    result = Class.create(1);
                    console.log(JSON.stringify(result));
                    expect(result.extends(Class)).toBeTruthy();
                    expect(result.extends(Forward)).toBeTruthy();
                });
            });

            describe("for non-matching arguments", function () {
                it("should instantiate original class", function () {
                    result = Class.create(0);
                    console.log(JSON.stringify(result));
                    expect(result.extends(Class)).toBeTruthy();
                    expect(result.extends(Forward)).toBeFalsy();
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

    describe("extension tester", function () {
        var Trait,
            Class,
            instance;

        beforeEach(function () {
            Trait = $oop.ClassBuilder.create('Trait')
                .build();
            Class = builder
                .extend(Trait)
                .build();
            instance = Class.create();
        });

        describe("on invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    instance.extends();
                }).toThrow();
            });
        });

        describe("on self", function () {
            it("should return true", function () {
                expect(Class.extends(Class)).toBe(true);
                expect(instance.extends(Class)).toBe(true);
            });
        });

        describe("on present extension", function () {
            it("should return true", function () {
                expect(instance.extends(Trait)).toBe(true);
            });
        });

        describe("on absent extension", function () {
            it("should return false", function () {
                var Trait2 = $oop.ClassBuilder.create('Trait2').build();
                expect(instance.extends(Trait2)).toBe(false);
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
