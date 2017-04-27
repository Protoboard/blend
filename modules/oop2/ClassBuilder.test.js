describe("ClassBuilder", function () {
    "use strict";

    var builder;

    describe("instantiation", function () {
        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    $oop.ClassBuilder.create();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var result;

            beforeEach(function () {
                result = $oop.ClassBuilder.create('ClassId');
            });

            it("should set initial descriptor", function () {
                expect(result.classId).toEqual('ClassId');
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
            var BaseClass = {
                    __contributes: {
                        foo: "FOO",
                        bar: function () {
                        }
                    }
                },
                result;

            beforeEach(function () {
                result = builder.extend(BaseClass);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add meta", function () {
                expect(builder.base).toBe(BaseClass);
            });

            it("should register overrides", function () {
                expect(builder.overrides).toEqual({
                    bar: [BaseClass.__contributes.bar]
                });
            });

            describe("when already extended", function () {
                it("should add throw", function () {
                    expect(function () {
                        builder.extend(BaseClass);
                    }).toThrow();
                });
            });
        });
    });

    describe("including", function () {
        beforeEach(function () {
            builder = $oop.ClassBuilder.create('ClassId');
        });

        describe("when passing no arguments", function () {
            it("should throw error", function () {
                expect(function () {
                    builder.include();
                }).toThrow();
            });
        });

        describe("otherwise", function () {
            var IncludedClass = {
                    __contributes: {
                        foo: "FOO",
                        bar: function () {
                        }
                    }
                },
                result;

            beforeEach(function () {
                result = builder.include(IncludedClass);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to meta", function () {
                expect(builder.includes).toEqual([IncludedClass]);
            });

            it("should register overrides", function () {
                expect(builder.overrides).toEqual({
                    bar: [IncludedClass.__contributes.bar]
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
            var RequiredClass = {},
                result;

            beforeEach(function () {
                result = builder.require(RequiredClass);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to meta", function () {
                expect(builder.requires).toEqual([RequiredClass]);
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
            var ImplementedInterface = {},
                result;

            beforeEach(function () {
                result = builder.implement(ImplementedInterface);
            });

            it("should return self", function () {
                expect(result).toBe(builder);
            });

            it("should add to meta", function () {
                expect(builder.interfaces).toEqual([ImplementedInterface]);
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

            it("should register overrides", function () {
                expect(builder.overrides).toEqual({
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
        var BaseClass = {
                __classId: 'BaseClass'
            },
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
                    .implement(Interface2);
            });

            describe("when doesn't implement all methods", function () {
                beforeEach(function () {
                    builder.contribute({
                        foo: function () {
                        }
                    });
                });

                it("should throw", function () {
                    expect(function () {
                        builder.build();
                    }).toThrow();
                });
            });

            describe("when implements all methods", function () {
                beforeEach(function () {
                    builder
                        .contribute({
                            foo: function () {
                            },
                            bar: function () {
                            }
                        });
                });

                it("should not throw", function () {
                    expect(function () {
                        builder.build();
                    }).not.toThrow();
                });
            });
        });

        it("should add class ID meta", function () {
            result = builder.build();
            expect(result.__classId).toBe('ClassId');
        });

        describe("when class has requires", function () {
            var Require1;

            beforeEach(function () {
                Require1 = $oop.ClassBuilder
                    .create('Require1')
                    .build();

                builder.require(Require1);
            });

            it("should add require meta", function () {
                result = builder.build();
                expect(result.__requires_0).toBe(Require1);
                expect(result.__requires_Require1).toBe(Require1);
            });
        });

        describe("when class has includes", function () {
            var Include1;

            beforeEach(function () {
                Include1 = $oop.ClassBuilder.create('Include1')
                    .require(BaseClass)
                    .build();

                builder.include(Include1);
            });

            describe("with unsatisfied requirements", function () {
                it("should throw", function () {
                    expect(function () {
                        builder.build();
                    }).toThrow();
                });
            });

            describe("with satisfied requirements", function () {
                beforeEach(function () {
                    builder.extend(BaseClass);
                });

                it("should not throw", function () {
                    expect(function () {
                        builder.build();
                    }).not.toThrow();
                });
            });
        });
    });
});
