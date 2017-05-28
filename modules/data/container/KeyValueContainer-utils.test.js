"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    var result;

    describe("getMapResultClass()", function () {
        describe("for values", function () {
            describe("to string", function () {
                it("should return STRING value variant", function () {
                    expect($data.getMapResultClass($data.Collection,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass($data.StringCollection,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass($data.Dictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass($data.StringDictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass($data.PairList,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass($data.StringPairList,
                        $data.VALUE_TYPES.VALUE_TYPE_STRING))
                        .toBe($data.StringPairList);
                });
            });

            describe("to any", function () {
                it("should return ANY value variant", function () {
                    expect($data.getMapResultClass($data.Collection,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass($data.StringCollection,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass($data.Dictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass($data.StringDictionary,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass($data.PairList,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass($data.StringPairList,
                        $data.VALUE_TYPES.VALUE_TYPE_ANY))
                        .toBe($data.PairList);
                });
            });
        });

        describe("for keys", function () {
            describe("to string", function () {
                it("should return self, or Dictionary variants", function () {
                    expect($data.getMapResultClass($data.Collection,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass($data.StringCollection,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass($data.Dictionary,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass($data.StringDictionary,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass($data.PairList,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass($data.StringPairList,
                        $data.KEY_TYPES.KEY_TYPE_STRING))
                        .toBe($data.StringDictionary);
                });
            });

            describe("to any", function () {
                it("should return PairList variants", function () {
                    expect($data.getMapResultClass($data.Collection,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass($data.StringCollection,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass($data.Dictionary,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass($data.StringDictionary,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass($data.PairList,
                        $data.KEY_TYPES.KEY_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass($data.StringPairList,
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