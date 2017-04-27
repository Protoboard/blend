describe("Class", function () {
    "use strict";

    var builder,
        Class;

    beforeEach(function () {
        $oop.ClassBuilder.builtClasses = {};
        builder = $oop.ClassBuilder.create('Class');
    });

    describe("meta properties retrieval", function () {
        beforeEach(function () {
            Class = builder.build();
            Class.__foo_0 = "FOO";
            Class.__foo_1 = "BAR";
            Class.__foo_2 = "BAZ";
            Class.__bar_0 = "hello";
            Class.__quux = "world";
        });

        it("should return values of prefixed properties", function () {
            var result = Class.getMetaProperties('foo');
            expect(result).toEqual(["FOO", "BAR", "BAZ"]);
        });
    });

    describe("instantiation", function () {
        describe("of trait", function () {
            var Require1 = {
                __id: 'Require1'
            };

            beforeEach(function () {
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
    });
});
