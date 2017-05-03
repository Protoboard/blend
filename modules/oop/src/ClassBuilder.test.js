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
                var result = $oop.ClassBuilder.create('Class');
                expect(result).toBe(builder);
            });
        });

        describe("otherwise", function () {
            var result;

            beforeEach(function () {
                result = $oop.ClassBuilder.create('Class');
            });

            it("should set class ID", function () {
                expect(result.classId).toEqual('Class');
            });

            it("should initialize requires", function () {
                expect(result.requireLookup).toEqual({});
            });

            it("should initialize interfaces", function () {
                expect(result.interfaceLookup).toEqual({});
            });

            it("should initialize includes", function () {
                expect(result.includeLookup).toEqual({});
            });

            it("should initialize members container", function () {
                expect(result.members).toEqual({});
            });

            it("should initialize contribution list", function () {
                expect(result.contributions).toEqual([]);
            });

            it("should initialize contribution lookup", function () {
                expect(result.contributionLookup).toEqual({});
            });

            it("should initialize forwards list", function () {
                expect(result.forwards).toEqual([]);
            });
        });
    });

    describe("defining members", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('Class');
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
                    builder.define();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var batch = {
                    foo: "FOO"
                },
                result;

            beforeEach(function () {
                result = builder.define(batch);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should merge batch into members", function () {
                expect(builder.members).not.toBe(batch);
                expect(builder.members).toEqual({
                    foo: "FOO"
                });
            });

            it("should add to list of contributions", function () {
                expect(builder.contributions).toEqual([builder.members]);
                expect(builder.contributionLookup).toEqual({
                    Class: true
                });
            });

            describe("on subsequent calls", function () {
                beforeEach(function () {
                    result = builder.define({
                        bar: "BAR"
                    });
                });

                it("should add to member", function () {
                    expect(builder.members).toEqual({
                        foo: "FOO",
                        bar: "BAR"
                    });
                });

                it("should not add to contributions again", function () {
                    expect(builder.contributions).toEqual([builder.members]);
                });
            });

            describe("on conflict", function () {
                beforeEach(function () {
                    result = builder.define({
                        foo: "BAR"
                    });
                });

                it("should overwrite member", function () {
                    expect(builder.members).toEqual({
                        foo: "BAR"
                    });
                });

                it("should not add to contributions again", function () {
                    expect(builder.contributions).toEqual([builder.members]);
                });
            });
        });
    });

    describe("inclusion", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('Class');
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    builder.include();
                }).toThrow();
            });
        });

        describe("when already built", function () {
            it("should throw", function () {
                var Include = $oop.ClassBuilder.create('Include').build();
                builder.build();
                expect(function () {
                    builder.include(Include);
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var Trait,
                result;

            beforeEach(function () {
                Trait = $oop.ClassBuilder.create('Trait')
                    .define({
                        foo: function () {
                        }
                    })
                    .build();

                result = builder.include(Trait);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to includes", function () {
                expect(builder.includeLookup).toEqual({
                    Trait: true
                });
            });

            it("should add to list of contributions", function () {
                expect(builder.contributions).toEqual([Trait.__defines]);
                expect(builder.contributionLookup).toEqual({
                    Trait: true
                });
            });

            describe("on duplication", function () {
                beforeEach(function () {
                    builder.include(Trait);
                });

                it("should not add to contributions again", function () {
                    expect(builder.contributions).toEqual([Trait.__defines]);
                });
            });

            describe("when already required", function () {
                var Trait2;

                beforeEach(function () {
                    Trait2 = $oop.ClassBuilder.create('Trait2')
                        .define({
                            foo: function () {
                            }
                        })
                        .build();

                    builder
                        .require(Trait2)
                        .include(Trait2);
                });

                it("should remove include from requires", function () {
                    expect(builder.requireLookup).toEqual({});
                });
            });
        });
    });

    describe("implementing interfaces", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('Class');
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
            var Interface,
                result;

            beforeEach(function () {
                Interface = $oop.ClassBuilder.create('Interface').build();
                result = builder.implement(Interface);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to interfaces", function () {
                expect(builder.interfaceLookup).toEqual({
                    Interface: true
                });
            });
        });
    });

    describe("requiring", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('Class');
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
            var Require,
                result;

            beforeEach(function () {
                Require = $oop.ClassBuilder.create('Require').build();
                result = builder.require(Require);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add requires", function () {
                expect(builder.requireLookup).toEqual({
                    Require: true
                });
            });

            describe("when already included", function () {
                var Require2;

                beforeEach(function () {
                    Require2 = $oop.ClassBuilder.create('Require2').build();

                    builder
                        .include(Require2)
                        .require(Require);
                });

                it("should not add require to requires", function () {
                    expect(builder.requireLookup).toEqual({
                        Require: true
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
            var Class;

            beforeEach(function () {
                Class = Object.create($oop.Class);
                builder.forward(Class, filter, 1);
            });

            it("should add forward descriptor", function () {
                expect(builder.forwards).toEqual([{
                    'class'   : Class,
                    'filter'  : filter,
                    'priority': 1
                }]);
            });

            describe("when appending lower priority", function () {
                var Class2,
                    filter2;

                it("should sort descriptors by priority", function () {
                    Class2 = Object.create($oop.Class);
                    filter2 = function () {
                    };
                    builder.forward(Class2, filter2, 10);

                    expect(builder.forwards).toEqual([{
                        'class'   : Class2,
                        'filter'  : filter2,
                        'priority': 10
                    }, {
                        'class'   : Class,
                        'filter'  : filter,
                        'priority': 1
                    }]);
                });
            });
        });
    });

    describe("caching", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('Class');
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

    describe("building class", function () {
        var result;

        beforeEach(function () {
            builder = $oop.ClassBuilder.create('Class');
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

        it("should set ID meta", function () {
            result = builder.build();
            expect(result.__id).toBe('Class');
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

        it("should set class on builder", function () {
            result = builder.build();
            expect(builder['class']).toBe(result);
        });

        it("should add class to registry", function () {
            result = builder.build();
            expect($oop.ClassBuilder.classes).toEqual({
                Class: result
            });
        });

        describe("when class implements interfaces", function () {
            var Interface1,
                Interface2;

            beforeEach(function () {
                Interface1 = $oop.ClassBuilder.create('Interface1')
                    .define({
                        foo: function () {
                        }
                    })
                    .build();

                Interface2 = $oop.ClassBuilder.create('Interface2')
                    .define({
                        bar: function () {
                        }
                    })
                    .build();

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

                    console.log($oop.ClassBuilder.classes)

                    result = builder
                        .include(Include2)
                        .build();
                });

                it("should set implements meta", function () {
                    expect(result.__implements).toEqual({
                        Interface1: true,
                        Interface2: true
                    });
                });
            });
        });

        describe("when class defines members", function () {
            beforeEach(function () {
                builder.define({
                    foo: "FOO"
                });
            });

            it("should add defines meta", function () {
                result = builder.build();
                expect(result.__defines).toBe(builder.members);
            });
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

            it("should add includes meta", function () {
                expect(result.__includes).toBe(builder.includeLookup);
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

            it("should set require meta", function () {
                result = builder.build();
                expect(result.__requires).toEqual({
                    Require1: true
                });
                expect(result.__requireIds).toEqual(['Require1']);
            });
        });

        describe("when there are no overrides", function () {
            var Include1;

            beforeEach(function () {
                Include1 = $oop.ClassBuilder.create('Include1')
                    .define({
                        foo: function () {
                        }
                    })
                    .build();
            });

            it("should move method to class", function () {
                result = builder
                    .include(Include1)
                    .build();

                expect(result.foo).toBe(Include1.__defines.foo);
            });
        });

        describe("when there are overrides", function () {
            var Include1,
                Include2,
                members,
                spy1, spy2, spy3;

            beforeEach(function () {
                Include1 = $oop.ClassBuilder.create('Include1')
                    .define({
                        foo: function () {
                        }
                    })
                    .build();

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
    });
});
