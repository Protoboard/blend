/* global $oop */
"use strict";

describe("ProtoclassBuilder", function () {
    var result;

    beforeEach(function () {
        result = $oop.ProtoclassBuilder.reset();
    });

    describe("resetting", function () {
        it("should return self", function () {
            expect(result).toBe($oop.ProtoclassBuilder);
        });

        it("should set extends property", function () {
            expect(result.hasOwnProperty('_extends')).toBeTruthy();
            expect(result._extends).toBeUndefined();
        });

        it("should set members property", function () {
            expect(result.hasOwnProperty('_members')).toBeTruthy();
            expect(result._members).toBeUndefined();
        });
    });

    describe("extending", function () {
        var Base;

        beforeEach(function () {
            Base = {};
            result = $oop.ProtoclassBuilder.extend(Base);
        });

        it("should return self", function () {
            expect(result).toBe($oop.ProtoclassBuilder);
        });

        it("should set _extends property", function () {
            expect(result._extends).toBe(Base);
        });
    });

    describe("defining members", function () {
        var members;

        beforeEach(function () {
            members = {};
            result = $oop.ProtoclassBuilder.define(members);
        });

        it("should return self", function () {
            expect(result).toBe($oop.ProtoclassBuilder);
        });

        it("should set _members property", function () {
            expect(result._members).toBe(members);
        });
    });

    describe("building", function () {
        var Base,
            members;

        beforeEach(function () {
            Base = {};
            members = {
                foo: "FOO",
                bar: function () {}
            };
            result = $oop.ProtoclassBuilder
                .extend(Base)
                .define(members)
                .build();
        });

        it("should return new class", function () {
            expect(Base.isPrototypeOf(result)).toBeTruthy();
        });

        it("should copy members to class", function () {
            expect(result).not.toBe(members);
            expect(result.foo).toBe("FOO");
            expect(result.bar).toBe(members.bar);
        });
    });
});
