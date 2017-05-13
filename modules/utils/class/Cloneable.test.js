"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("Cloneable", function () {
    var Cloneable,
        cloneable;

    beforeEach(function () {
        Cloneable = $oop.getClass('Cloneable')
            .include($utils.Cloneable)
            .define({
                clone: function clone() {
                    return clone.returned;
                }
            });
        cloneable = Cloneable.create();
    });

    describe("cloning", function () {
        var clone;

        beforeEach(function () {
            clone = cloneable.clone();
        });

        it("should return new instance", function () {
            expect(Cloneable.isPrototypeOf(clone)).toBeTruthy();
        });
    });
});
