"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("$utils", function () {
    describe("Retrievable", function () {
        var Retrievable,
            instance;

        beforeEach(function () {
            $utils.Identifiable._lastInstanceId = -1;
            $utils.Retrievable._instanceRegistry = {};
            Retrievable = $oop.getClass("Retrievable")
                .extend($utils.Retrievable);
        });

        describe("create()", function () {
            beforeEach(function () {
                instance = Retrievable.create();
            });

            it("should add instance to registry", function () {
                expect($utils.Retrievable._instanceRegistry).toEqual({
                    0: instance
                });
            });
        });

        describe("getInstanceById()", function () {
            beforeEach(function () {
                instance = Retrievable.create();
            });

            describe("for absent ID", function () {
                it("should return undefined", function () {
                    expect($utils.Retrievable.getInstanceById(100)).toBeUndefined();
                });
            });

            it("should return instance matching ID", function () {
                expect($utils.Retrievable.getInstanceById(0)).toBe(instance);
                expect(Retrievable.getInstanceById(0)).toBe(instance);
            });
        });

        describe("destroy()", function () {
            var result;

            beforeEach(function () {
                spyOn(Retrievable, '_removeFromInstanceRegistry');
                instance = Retrievable.create();
                result = instance.destroy();
            });

            it("should return self", function () {
                expect(result).toBe(instance);
            });

            it("should remove instance from registry", function () {
                expect(Retrievable._removeFromInstanceRegistry).toHaveBeenCalled();
            });
        });
    });
});