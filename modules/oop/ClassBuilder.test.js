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
            var Trait = {
                    __id: 'Trait',
                    __contributes: {
                        foo: "FOO",
                        bar: function () {
                        }
                    },
                    __extends: {
                        'Base': true
                    },
                    __requires: {
                        'Widget': true,
                        'OtherTrait': true
                    }
                },
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
                var RequiredClass = {
                        __id: 'RequiredClass'
                    },
                    result;

                beforeEach(function () {
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
                var RequiredClass = {
                    __id: 'RequiredClass',
                    __extends: {
                        'Base': true
                    },
                    __requires: {
                        'Widget': true,
                        'OtherTrait': true
                    }
                };

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
            var ImplementedInterface = {
                    __id: 'ImplementedInterface'
                },
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
            var Interface1 = {
                foo: true
            }, Interface2 = {
                bar: true
            };

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

        // describe("when class has requires", function () {
        //     var Require1;
        //
        //     beforeEach(function () {
        //         Require1 = $oop.ClassBuilder
        //             .create('Require1')
        //             .build();
        //
        //         builder.require(Require1);
        //     });
        //
        //     it("should add require meta", function () {
        //         result = builder.build();
        //         expect(result.__requires.Require1).toBe(true);
        //     });
        // });

        describe("when class has extensions", function () {
            var Extended2;

            beforeEach(function () {
                Extended2 = $oop.ClassBuilder.create('Extended2')
                    .require(Extended1)
                    .build();

                builder.extend(Extended2);
            });

            // describe("with unsatisfied requirements", function () {
            //     it("should throw", function () {
            //         expect(function () {
            //             builder.build();
            //         }).toThrow();
            //     });
            // });

            describe("with satisfied requirements", function () {
                beforeEach(function () {
                    builder.extend(Extended1);
                });

                it("should not throw", function () {
                    expect(function () {
                        builder.build();
                    }).not.toThrow();
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
            var Extended2 = $oop.ClassBuilder.create('Extended2')
                    .contribute({
                        foo: function () {
                        }
                    })
                    .build(),
                contributions;

            beforeEach(function () {
                contributions = {
                    foo: function () {
                    }
                };

                spyOn(Extended1.__contributes, 'foo');
                spyOn(Extended2.__contributes, 'foo');
                spyOn(contributions, 'foo');

                result = builder
                    .extend(Extended1)
                    .extend(Extended2)
                    .contribute(contributions)
                    .build();
            });

            it("should call all overrides", function () {
                result.foo();
                expect(Extended1.__contributes.foo).toHaveBeenCalled();
                expect(Extended2.__contributes.foo).toHaveBeenCalled();
                expect(contributions.foo).toHaveBeenCalled();
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
