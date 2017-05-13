"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("$utils", function () {
    describe("Identifiable", function () {
        var Identifiable;

        beforeEach(function () {
            $utils.Identifiable.lastInstanceId = -1;
            Identifiable = $oop.getClass('Identifiable')
                .extend($utils.Identifiable);
        });

        describe("create()", function () {
            var instance;

            beforeEach(function () {
                instance = Identifiable.create();
            });

            it("should set instanceId", function () {
                expect(instance.instanceId).toBe(0);
            });

            it("should increment lastInstanceId", function () {
                expect($utils.Identifiable.lastInstanceId).toBe(0);
            });
        });
    });
});