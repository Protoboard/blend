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

            it("should set initial descriptor", function () {
                expect(result.classId).toEqual('ClassId');
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
                    __id: 'IncludedClass',
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
                expect(builder.includes).toEqual({
                    IncludedClass: IncludedClass
                });
            });

            it("should register methods", function () {
                expect(builder.methods).toEqual({
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
                expect(builder.requires).toEqual({
                    RequiredClass: RequiredClass
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
        var BaseClass = $oop.ClassBuilder.create('BaseClass')
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
                var Include1;

                beforeEach(function () {
                    Include1 = $oop.ClassBuilder.create('Include1')
                        .contribute({
                            bar: function () {
                            }
                        })
                        .build();

                    builder.include(Include1);
                });

                it("should not throw", function () {
                    expect(function () {
                        builder.build();
                    }).not.toThrow();
                });
            });
        });

        it("should add builder meta", function () {
            result = builder.build();
            expect(result.__builder).toBe(builder);
        });

        it("should add ID meta", function () {
            result = builder.build();
            expect(result.__id).toBe('ClassId');
        });

        it("should add contributions meta", function () {
            result = builder.build();
            expect(result.__contributes).toBe(builder.contributions);
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
                expect(result.__requires.Require1).toBe(Require1);
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
                    builder.include(BaseClass);
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
                    .include(BaseClass)
                    .build();

                expect(result.foo).toBe(BaseClass.__contributes.foo);
            });
        });

        describe("when there are overrides", function () {
            var Include1 = $oop.ClassBuilder.create('Include1')
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

                spyOn(BaseClass.__contributes, 'foo');
                spyOn(Include1.__contributes, 'foo');
                spyOn(contributions, 'foo');

                result = builder
                    .include(BaseClass)
                    .include(Include1)
                    .contribute(contributions)
                    .build();
            });

            it("should call all overrides", function () {
                result.foo();
                expect(BaseClass.__contributes.foo).toHaveBeenCalled();
                expect(Include1.__contributes.foo).toHaveBeenCalled();
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
