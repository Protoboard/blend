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
