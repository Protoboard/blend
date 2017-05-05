/* global $oop */
"use strict";

describe("ClassBuilder", function () {
    var Class,
        result;

    beforeEach(function () {
        $oop.ClassBuilder.classes = {};
    });

    describe("creation", function () {
        beforeEach(function () {
            Class = $oop.ClassBuilder.build('Class');
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $oop.ClassBuilder.build();
                }).toThrow();
            });
        });

        describe("when class already created", function () {
            beforeEach(function () {
                result = $oop.ClassBuilder.build('Class');
            });

            it("should return same class", function () {
                expect(result).toBe(Class);
            });
        });

        it("should set class ID", function () {
            expect(result.__classId).toEqual('Class');
        });

        it("should initialize method matrix", function () {
            expect(result.__methodMatrix).toEqual({});
        });

        it("should initialize member container", function () {
            expect(result.__members).toEqual({});
        });

        it("should initialize contributors", function () {
            expect(result.__contributors).toEqual([]);
            expect(result.__contributorIndexLookup).toEqual({});
        });

        it("should initialize interfaces", function () {
            expect(result.__interfaces).toEqual([]);
            expect(result.__interfaceLookup).toEqual({});
        });

        it("should initialize missing method names", function () {
            expect(result.__missingMethodNames).toEqual([]);
            expect(result.__missingMethodLookup).toEqual({});
        });

        it("should initialize includes", function () {
            expect(result.__includes).toEqual([]);
            expect(result.__includeLookup).toEqual({});
        });

        it("should initialize requires", function () {
            expect(result.__requires).toEqual([]);
            expect(result.__requireLookup).toEqual({});
        });

        it("should initialize forwards", function () {
            expect(result.__forwards).toEqual([]);
        });

        it("should initialize hash function", function () {
            expect(result.__mapper).toBeUndefined();
        });

        it("should initialize instance lookup", function () {
            expect(result.__instanceLookup).toEqual({});
        });
    });
});
