describe("ClassBuilder", function () {
    "use strict";

    var builder;

    beforeEach(function () {
        $oop.ClassBuilder.builders = {};
        $oop.ClassBuilder.classes = {};
    });

    describe("instantiation", function () {
        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $oop.ClassBuilder.create();
                }).toThrow();
            });
        });

        describe("when class already being built", function () {
             beforeEach(function () {
                builder = $oop.ClassBuilder.create('Class');
             });

             it("should return same builder", function () {
                var result =  $oop.ClassBuilder.create('Class');
                expect(result).toBe(builder);
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

            it("should initialize inclusion registry", function () {
                expect(result.includes).toEqual({});
            });

            it("should initialize member registry", function () {
                expect(result.members).toEqual({});
            });

            it("should initialize methods registry", function () {
                expect(result.methods).toEqual({});
            });
        });
    });

    describe("inclusion", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    builder.include();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var Trait = $oop.ClassBuilder.create('Trait')
                    .include($oop.ClassBuilder.create('Base').build())
                    .require($oop.ClassBuilder.create('Widget').build())
                    .require($oop.ClassBuilder.create('OtherTrait').build())
                    .define({
                        foo: "FOO",
                        bar: function () {
                        }
                    })
                    .build(),
                result;

            beforeEach(function () {
                result = builder.include(Trait);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to meta", function () {
                expect(builder.includes).toEqual({
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
                    bar: [Trait.__defines.bar]
                });
            });
        });
    });

    describe("requiring", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    builder.require();
                }).toThrow();
            });
        });

        describe("when class already built", function () {
            it("should throw", function () {
                builder.build();

                expect(function () {
                    builder.require();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            describe("when require has no requires or includes", function () {
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

            describe("when require does have requires or includes", function () {
                var RequiredClass;

                beforeEach(function () {
                    RequiredClass = $oop.ClassBuilder.create('RequiredClass')
                        .include($oop.ClassBuilder.create('Base').build())
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
            it("should throw", function () {
                expect(function () {
                    builder.implement();
                }).toThrow();
            });
        });

        describe("when class already built", function () {
            it("should throw", function () {
                builder.build();

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

        describe("when class already built", function () {
            it("should throw", function () {
                builder.build();

                expect(function () {
                    builder.implement();
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

    describe("defining members", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    builder.define();
                }).toThrow();
            });
        });

        describe("when class already built", function () {
            it("should throw", function () {
                builder.build();

                expect(function () {
                    builder.implement();
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
                result = builder.define(properties);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should copy meta", function () {
                expect(builder.members).not.toBe(properties);
                expect(builder.members).toEqual(properties);
            });

            it("should register methods", function () {
                expect(builder.methods).toEqual({
                    bar: [properties.bar]
                });
            });

            describe("when already having own properties", function () {
                it("should add to meta", function () {
                    builder.define({
                        baz: "BAZ"
                    });
                    expect(builder.members).toEqual({
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
        var Include1 = $oop.ClassBuilder.create('Include1')
                .define({
                    foo: function () {
                    }
                })
                .build(),
            result;

        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when class already built", function () {
            beforeEach(function () {
                builder.build();
            });

            it("should throw", function () {
                expect(function () {
                    builder.build();
                }).toThrow();
            });
        });

        describe("when class implements interfaces", function () {
            var Interface1 = $oop.ClassBuilder.create('Interface1')
                    .define({
                        foo: function () {
                        }
                    })
                    .build(),
                Interface2 = $oop.ClassBuilder.create('Interface2')
                    .define({
                        bar: function () {
                        }
                    })
                    .build();

            beforeEach(function () {
                builder
                    .implement(Interface1)
                    .implement(Interface2)
                    .define({
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
                var Include2;

                beforeEach(function () {
                    Include2 = $oop.ClassBuilder.create('Include2')
                        .define({
                            bar: function () {
                            }
                        })
                        .build();

                    builder.include(Include2);
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

        it("should add members meta", function () {
            result = builder.build();
            expect(result.__defines).toBe(builder.members);
        });

        it("should copy properties", function () {
            result = builder
                .include($oop.ClassBuilder.create('Trait')
                    .define({
                        foo: "FOO",
                        bar: "BAR"
                    })
                    .build())
                .define({
                    foo: "BAZ"
                })
                .build();

            expect(result).toEqual({
                foo: "BAZ",
                bar: "BAR"
            });
        });

        it("should add forwards meta", function () {
            result = builder.build();
            expect(result.__forwards).toBe(builder.forwards);
        });

        describe("when class has includes", function () {
            var Include2;

            beforeEach(function () {
                Include2 = $oop.ClassBuilder.create('Include2')
                    .build();

                result = builder
                    .include(Include2)
                    .build();
            });

            it("should add meta", function () {
                expect(result.__includes).toBe(builder.includes);
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
                    builder.include(Require1);
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
                    .include(Include1)
                    .build();

                expect(result.foo).toBe(Include1.__defines.foo);
            });
        });

        describe("when there are overrides", function () {
            var Include2,
                members,
                spy1, spy2, spy3;

            beforeEach(function () {
                Include2 = $oop.ClassBuilder.create('Include2')
                    .define({
                        foo: function () {
                        }
                    })
                    .build();

                members = {
                    foo: function () {
                    }
                };

                spy1 = spyOn(Include1.__defines, 'foo');
                spy2 = spyOn(Include2.__defines, 'foo');
                spy3 = spyOn(members, 'foo');

                result = builder
                    .include(Include1)
                    .include(Include2)
                    .define(members)
                    .build();
            });

            it("should call all overrides", function () {
                result.foo(1, 2, 3);
                expect(Include1.__defines.foo).toHaveBeenCalledWith(1, 2, 3);
                expect(Include2.__defines.foo).toHaveBeenCalledWith(1, 2, 3);
                expect(members.foo).toHaveBeenCalledWith(1, 2, 3);
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

        it("should set class on builder", function () {
            result = builder.build();
            expect(builder['class']).toBe(result);
        });

        it("should add class to registry", function () {
            result = builder.build();
            expect($oop.ClassBuilder.classes).toEqual({
                ClassId: result
            });
        });
    });
});
