"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    var result;

    describe("getMapResultClass()", function () {
        var Collection,
            StringCollection,
            Dictionary,
            StringDictionary,
            PairList,
            StringPairList;

        beforeEach(function () {
            $oop.Class.classLookup = {};

            Collection = $oop.getClass('Collection')
                .extend($data.Collection);
            StringCollection = $oop.getClass('StringCollection')
                .extend($data.StringCollection);
            Dictionary = $oop.getClass('Dictionary')
                .extend($data.Dictionary);
            StringDictionary = $oop.getClass('StringDictionary')
                .extend($data.StringDictionary);
            PairList = $oop.getClass('PairList')
                .extend($data.PairList);
            StringPairList = $oop.getClass('StringPairList')
                .extend($data.StringPairList);
        });

        describe("for values", function () {
            describe("to string", function () {
                it("should return STRING value variant", function () {
                    expect($data.getMapResultClass(Collection,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass(StringCollection,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass(Dictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass(StringDictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass(PairList,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass(StringPairList,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringPairList);
                });
            });

            describe("to any", function () {
                it("should return ANY value variant", function () {
                    expect($data.getMapResultClass(Collection,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass(StringCollection,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass(Dictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(StringDictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(PairList,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringPairList,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.PairList);
                });
            });
        });

        describe("for keys", function () {
            describe("to string", function () {
                it("should return self, or Dictionary variants", function () {
                    expect($data.getMapResultClass(Collection,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass(StringCollection,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass(Dictionary,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(StringDictionary,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass(PairList,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(StringPairList,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.StringDictionary);
                });
            });

            describe("to any", function () {
                it("should return PairList variants", function () {
                    expect($data.getMapResultClass(Collection,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringCollection,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass(Dictionary,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringDictionary,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass(PairList,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringPairList,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.StringPairList);
                });
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