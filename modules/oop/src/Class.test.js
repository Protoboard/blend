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
            var Require1 = $oop.ClassBuilder.create('Require1')
                .build();

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

        describe("of non-trait", function () {
            it("should not throw", function () {
                Class = builder.build();

                expect(function () {
                    Class.create();
                }).not.toThrow();
            });
        });
    });
});
