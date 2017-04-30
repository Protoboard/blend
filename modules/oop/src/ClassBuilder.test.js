describe("ClassBuilder", function () {
    "use strict";

    var builder;

    beforeEach(function () {
        $oop.ClassBuilder.builtClasses = {};
    });

    describe("instantiation", function () {
        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    $oop.ClassBuilder.create();
                }).toThrow();
            });
        });

        describe("when class already built", function () {
            beforeEach(function () {
                $oop.ClassBuilder.builtClasses.ClassId = {};
            });

            it("should throw", function () {
                expect(function () {
                    $oop.ClassBuilder.create('ClassId');
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var result;

            beforeEach(function () {
                result = $oop.ClassBuilder.create('ClassId');
            });

            it("should set class ID", function () {
                expect(result.classId).toEqual('ClassId');
            });

            it("should initialize requires", function () {
                expect(result.requires).toEqual({
                    demanded: {},
                    fulfilled: {
                        ClassId: true
                    }
                });
            });

            it("should initialize interface registry", function () {
                expect(result.interfaces).toEqual({});
            });

            it("should initialize extension registry", function () {
                expect(result.extensions).toEqual({});
            });

            it("should initialize contribution registry", function () {
                expect(result.contributions).toEqual({});
            });

            it("should initialize methods registry", function () {
                expect(result.methods).toEqual({});
            });
        });
    });

    describe("extending", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    builder.extend();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var Trait = $oop.ClassBuilder.create('Trait')
                    .extend($oop.ClassBuilder.create('Base').build())
                    .require($oop.ClassBuilder.create('Widget').build())
                    .require($oop.ClassBuilder.create('OtherTrait').build())
                    .contribute({
                        foo: "FOO",
                        bar: function () {
                        }
                    })
                    .build(),
                result;

            beforeEach(function () {
                result = builder.extend(Trait);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to meta", function () {
                expect(builder.extensions).toEqual({
                    Trait: true
                });
            });

            it("should add to fulfilled requires", function () {
                expect(builder.requires.fulfilled).toEqual({
                    ClassId: true,
                    Trait: true
                });
            });

            it("should extract requires", function () {
                expect(builder.requires.demanded).toEqual({
                    Base: true,
                    Widget: true,
                    OtherTrait: true
                });
            });

            it("should register properties", function () {
                expect(builder.properties).toEqual({
                    foo: "FOO"
                });
            });

            it("should register methods", function () {
                expect(builder.methods).toEqual({
                    bar: [Trait.__contributes.bar]
                });
            });
        });
    });

    describe("requiring", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    builder.require();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            describe("when require has no requires or extensions", function () {
                var RequiredClass,
                    result;

                beforeEach(function () {
                    RequiredClass = $oop.ClassBuilder.create('RequiredClass').build();
                    result = builder.require(RequiredClass);
                });

                it("should return self", function () {
                    expect(result).toBe(builder);
                });

                it("should add to meta", function () {
                    expect(builder.requires.demanded).toEqual({
                        RequiredClass: true
                    });
                });
            });

            describe("when require does have requires or extensions", function () {
                var RequiredClass;

                beforeEach(function () {
                    RequiredClass = $oop.ClassBuilder.create('RequiredClass')
                        .extend($oop.ClassBuilder.create('Base').build())
                        .require($oop.ClassBuilder.create('Widget').build())
                        .require($oop.ClassBuilder.create('OtherTrait').build())
                        .build();
                });

                it("should extract requires", function () {
                    builder.require(RequiredClass);

                    expect(builder.requires.demanded).toEqual({
                        RequiredClass: true,
                        Base: true,
                        Widget: true,
                        OtherTrait: true
                    });
                });
            });
        });
    });

    describe("implementing interfaces", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    builder.implement();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var ImplementedInterface = $oop.ClassBuilder.create('ImplementedInterface').build(),
                result;

            beforeEach(function () {
                result = builder.implement(ImplementedInterface);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to meta", function () {
                expect(builder.interfaces).toEqual({
                    ImplementedInterface: ImplementedInterface
                });
            });
        });
    });

    describe("caching", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    builder.cache();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var mapper,
                result;

            beforeEach(function () {
                mapper = function () {
                };
                result = builder.cache(mapper);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should set mapper function", function () {
                expect(builder.mapper).toBe(mapper);
            });
        });
    });

    describe("contributing", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    builder.contribute();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var properties = {
                    foo: "FOO",
                    bar: function () {
                    }
                },
                result;

            beforeEach(function () {
                result = builder.contribute(properties);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should copy meta", function () {
                expect(builder.contributions).not.toBe(properties);
                expect(builder.contributions).toEqual(properties);
            });

            it("should register methods", function () {
                expect(builder.methods).toEqual({
                    bar: [properties.bar]
                });
            });

            describe("when already having own properties", function () {
                it("should add to meta", function () {
                    builder.contribute({
                        baz: "BAZ"
                    });
                    expect(builder.contributions).toEqual({
                        foo: "FOO",
                        bar: properties.bar,
                        baz: "BAZ"
                    });
                });
            });
        });
    });

    describe("forwarding", function () {
        var filter;

        beforeEach(function () {
            filter = function () {
            };
            builder = $oop.ClassBuilder.create('Class');
        });

        describe("when passing invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    builder.forward(null, filter, 1);
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var SubClass;

            beforeEach(function () {
                SubClass = $oop.ClassBuilder.create('SubClass').build();
                builder.forward(SubClass, filter, 1);
            });

            it("should add forward descriptor", function () {
                expect(builder.forwards).toEqual([{
                    'class': SubClass,
                    'filter': filter,
                    'priority': 1
                }]);
            });

            describe("when appending lower priority", function () {
                var SubClass2,
                    filter2;

                it("should sort descriptors by priority", function () {
                    SubClass2 = $oop.ClassBuilder.create('SubClass2').build();
                    filter2 = function () {
                    };
                    builder.forward(SubClass2, filter2, 10);

                    expect(builder.forwards).toEqual([{
                        'class': SubClass2,
                        'filter': filter2,
                        'priority': 10
                    }, {
                        'class': SubClass,
                        'filter': filter,
                        'priority': 1
                    }]);
                });
            });
        });
    });

    describe("building class", function () {
        var Extended1 = $oop.ClassBuilder.create('Extended1')
                .contribute({
                    foo: function () {
                    }
                })
                .build(),
            result;

        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when class implements interfaces", function () {
            var Interface1 = $oop.ClassBuilder.create('Interface1')
                    .contribute({
                        foo: function () {
                        }
                    })
                    .build(),
                Interface2 = $oop.ClassBuilder.create('Interface2')
                    .contribute({
                        bar: function () {
                        }
                    })
                    .build();

            beforeEach(function () {
                builder
                    .implement(Interface1)
                    .implement(Interface2)
                    .contribute({
                        foo: function () {
                        }
                    });
            });

            describe("when doesn't implement all methods", function () {
                it("should throw", function () {
                    expect(function () {
                        builder.build();
                    }).toThrow();
                });
            });

            describe("when implements all methods", function () {
                var Extended2;

                beforeEach(function () {
                    Extended2 = $oop.ClassBuilder.create('Extended2')
                        .contribute({
                            bar: function () {
                            }
                        })
                        .build();

                    builder.extend(Extended2);
                });

                it("should not throw", function () {
                    expect(function () {
                        builder.build();
                    }).not.toThrow();
                });
            });
        });

        it("should add ID meta", function () {
            result = builder.build();
            expect(result.__id).toBe('ClassId');
        });

        it("should add contributions meta", function () {
            result = builder.build();
            expect(result.__contributes).toBe(builder.contributions);
        });

        it("should copy properties", function () {
            result = builder
                .extend($oop.ClassBuilder.create('Trait')
                    .contribute({
                        foo: "FOO",
                        bar: "BAR"
                    })
                    .build())
                .contribute({
                    foo: "BAZ"
                })
                .build();

            expect(result).toEqual({
                foo: "BAZ",
                bar: "BAR"
            });
        });

        it("should add builder reference", function () {
            result = builder.build();
            expect(result.__builder).toBe(builder);
        });

        it("should add forwards meta", function () {
            result = builder.build();
            expect(result.__forwards).toBe(builder.forwards);
        });

        describe("when class has extensions", function () {
            var Extended2;

            beforeEach(function () {
                Extended2 = $oop.ClassBuilder.create('Extended2')
                    .build();

                result = builder
                    .extend(Extended2)
                    .build();
            });

            it("should add meta", function () {
                expect(result.__extends).toBe(builder.extensions);
            });
        });

        describe("when class has requires", function () {
            var Require1;

            beforeEach(function () {
                Require1 = $oop.ClassBuilder
                    .create('Require1')
                    .build();

                builder.require(Require1);
            });

            describe("fulfilled", function () {
                beforeEach(function () {
                    builder.extend(Require1);
                });

                it("should not popuplate required meta", function () {
                    result = builder.build();
                    expect(result.__requires).toBeUndefined();
                });
            });

            describe("unfulfilled", function () {
                it("should add require meta", function () {
                    result = builder.build();
                    expect(result.__requires).toEqual({
                        Require1: true
                    });
                });
            });
        });

        describe("when there are no overrides", function () {
            it("should move method to class", function () {
                result = builder
                    .extend(Extended1)
                    .build();

                expect(result.foo).toBe(Extended1.__contributes.foo);
            });
        });

        describe("when there are overrides", function () {
            var Extended2,
                contributions,
                spy1, spy2, spy3;

            beforeEach(function () {
                Extended2 = $oop.ClassBuilder.create('Extended2')
                    .contribute({
                        foo: function () {
                        }
                    })
                    .build();

                contributions = {
                    foo: function () {
                    }
                };

                spy1 = spyOn(Extended1.__contributes, 'foo');
                spy2 = spyOn(Extended2.__contributes, 'foo');
                spy3 = spyOn(contributions, 'foo');

                result = builder
                    .extend(Extended1)
                    .extend(Extended2)
                    .contribute(contributions)
                    .build();
            });

            it("should call all overrides", function () {
                result.foo(1, 2, 3);
                expect(Extended1.__contributes.foo).toHaveBeenCalledWith(1, 2, 3);
                expect(Extended2.__contributes.foo).toHaveBeenCalledWith(1, 2, 3);
                expect(contributions.foo).toHaveBeenCalledWith(1, 2, 3);
            });

            describe("when returning same value", function () {
                beforeEach(function () {
                    spy1.and.returnValue(1);
                    spy2.and.returnValue(1);
                    spy3.and.returnValue(1);
                });

                it("should return single value", function () {
                    expect(result.foo()).toBe(1);
                });
            });

            describe("when returning different values", function () {
                beforeEach(function () {
                    spy1.and.returnValue(1);
                    spy2.and.returnValue(2);
                    spy3.and.returnValue(3);
                });

                it("should return array", function () {
                    expect(result.foo()).toEqual([1, 2, 3]);
                });
            });
        });

        it("should add class to registry", function () {
            result = builder.build();
            expect($oop.ClassBuilder.builtClasses).toEqual({
                ClassId: result
            });
        });
    });
});
