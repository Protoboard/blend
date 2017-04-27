describe("Class", function () {
    "use strict";

    var Class;

    beforeEach(function () {
        Class = Object.create($oop.Class);
    });

    describe("meta properties retrieval", function () {
        beforeEach(function () {
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
});
