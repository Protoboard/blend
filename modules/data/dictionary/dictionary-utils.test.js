"use strict";

var $data = window['giant-data'];

// TODO: Add assertions when classes are available
describe("$data", function () {
    describe("getMapResultClass()", function () {
        describe("for values", function () {
            describe("to string", function () {
                it("should return STRING value variant");
            });
            describe("to any", function () {
                it("should return ANY value variant");
            });
        });
        describe("for keys", function () {
            describe("to string", function () {
                it("should return self, or Dictionary variants");
            });
            describe("to any", function () {
                it("should return PairList variants");
            });
        });
    });

    describe("getSwapResultClass()", function () {
        it("should return swap result class");
    });

    describe("getJoinResultClass()", function () {
        it("should return join result class");
    });
});