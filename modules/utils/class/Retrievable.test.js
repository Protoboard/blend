"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("Retrievable", function () {
    var Retrievable,
        instance;

    beforeEach(function () {
        $utils.Identifiable.lastInstanceId = -1;
        $utils.Retrievable.instanceRegistry = {};
        Retrievable = $oop.getClass("Retrievable")
        // TODO: Replace w/ .extend when ready
            .include($utils.Identifiable)
            .include($utils.Retrievable);
    });

    describe("instantiation", function () {
        beforeEach(function () {
            instance = Retrievable.create();
        });

        it("should add instance to registry", function () {
            expect($utils.Retrievable.instanceRegistry).toEqual({
                0: instance
            });
        });
    });

    describe("instance fetcher", function () {
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

    describe("destroy", function () {
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
