"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    var Collection,
        StringCollection,
        Dictionary,
        StringDictionary,
        PairList,
        StringPairList,
        result;

    beforeEach(function () {
        Collection = $oop.getClass('test.$data.KeyValueContainer-utils.Collection')
            .extend($data.Collection);
        StringCollection = $oop.getClass('test.$data.KeyValueContainer-utils.StringCollection')
            .extend($data.StringCollection);
        Dictionary = $oop.getClass('test.$data.KeyValueContainer-utils.Dictionary')
            .extend($data.Dictionary);
        StringDictionary = $oop.getClass('test.$data.KeyValueContainer-utils.StringDictionary')
            .extend($data.StringDictionary);
        PairList = $oop.getClass('test.$data.KeyValueContainer-utils.PairList')
            .extend($data.PairList);
        StringPairList = $oop.getClass('test.$data.KeyValueContainer-utils.StringPairList')
            .extend($data.StringPairList);
    });

    describe("getMapResultClass()", function () {
        describe("for values", function () {
            describe("to string", function () {
                it("should return STRING value variant", function () {
                    expect($data.getMapResultClass(Collection,
                        null, $data.VALUE_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass(StringCollection,
                        null, $data.VALUE_TYPE_STRING))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass(Dictionary,
                        null, $data.VALUE_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass(StringDictionary,
                        null, $data.VALUE_TYPE_STRING))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass(PairList,
                        null, $data.VALUE_TYPE_STRING))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass(StringPairList,
                        null, $data.VALUE_TYPE_STRING))
                        .toBe($data.StringPairList);
                });
            });

            describe("to any", function () {
                it("should return ANY value variant", function () {
                    expect($data.getMapResultClass(Collection,
                        null, $data.VALUE_TYPE_ANY))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass(StringCollection,
                        null, $data.VALUE_TYPE_ANY))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass(Dictionary,
                        null, $data.VALUE_TYPE_ANY))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(StringDictionary,
                        null, $data.VALUE_TYPE_ANY))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(PairList,
                        null, $data.VALUE_TYPE_ANY))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringPairList,
                        null, $data.VALUE_TYPE_ANY))
                        .toBe($data.PairList);
                });
            });
        });

        describe("for keys", function () {
            describe("to string", function () {
                it("should return self, or Dictionary variants", function () {
                    expect($data.getMapResultClass(Collection,
                        $data.KEY_TYPE_STRING, null))
                        .toBe($data.Collection);
                    expect($data.getMapResultClass(StringCollection,
                        $data.KEY_TYPE_STRING, null))
                        .toBe($data.StringCollection);
                    expect($data.getMapResultClass(Dictionary,
                        $data.KEY_TYPE_STRING, null))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(StringDictionary,
                        $data.KEY_TYPE_STRING, null))
                        .toBe($data.StringDictionary);
                    expect($data.getMapResultClass(PairList,
                        $data.KEY_TYPE_STRING, null))
                        .toBe($data.Dictionary);
                    expect($data.getMapResultClass(StringPairList,
                        $data.KEY_TYPE_STRING, null))
                        .toBe($data.StringDictionary);
                });
            });

            describe("to any", function () {
                it("should return PairList variants", function () {
                    expect($data.getMapResultClass(Collection,
                        $data.KEY_TYPE_ANY, null))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringCollection,
                        $data.KEY_TYPE_ANY, null))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass(Dictionary,
                        $data.KEY_TYPE_ANY, null))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringDictionary,
                        $data.KEY_TYPE_ANY, null))
                        .toBe($data.StringPairList);
                    expect($data.getMapResultClass(PairList,
                        $data.KEY_TYPE_ANY, null))
                        .toBe($data.PairList);
                    expect($data.getMapResultClass(StringPairList,
                        $data.KEY_TYPE_ANY, null))
                        .toBe($data.StringPairList);
                });
            });
        });
    });

    describe("getSwapResultClass()", function () {
        it("should return swap result class", function () {
            expect($data.getSwapResultClass(Collection))
                .toBe($data.StringPairList);
            expect($data.getSwapResultClass(StringCollection))
                .toBe($data.StringDictionary);
            expect($data.getSwapResultClass(Dictionary))
                .toBe($data.StringPairList);
            expect($data.getSwapResultClass(StringDictionary))
                .toBe($data.StringDictionary);
            expect($data.getSwapResultClass(PairList))
                .toBe($data.PairList);
            expect($data.getSwapResultClass(StringPairList))
                .toBe($data.Dictionary);
        });
    });

    describe("getJoinResultClass()", function () {
        it("should return join result class", function () {
            expect($data.getJoinResultClass(StringCollection, Collection))
                .toBe($data.Collection);
            expect($data.getJoinResultClass(StringCollection, StringCollection))
                .toBe($data.StringCollection);
            expect($data.getJoinResultClass(StringCollection, Dictionary))
                .toBe($data.Dictionary);
            expect($data.getJoinResultClass(StringCollection, StringDictionary))
                .toBe($data.StringDictionary);

            expect($data.getJoinResultClass(StringDictionary, Collection))
                .toBe($data.Dictionary);
            expect($data.getJoinResultClass(StringDictionary, StringCollection))
                .toBe($data.StringDictionary);
            expect($data.getJoinResultClass(StringDictionary, Dictionary))
                .toBe($data.Dictionary);
            expect($data.getJoinResultClass(StringDictionary, StringDictionary))
                .toBe($data.StringDictionary);

            expect($data.getJoinResultClass(StringPairList, Collection))
                .toBe($data.PairList);
            expect($data.getJoinResultClass(StringPairList, StringCollection))
                .toBe($data.StringPairList);
            expect($data.getJoinResultClass(StringPairList, Dictionary))
                .toBe($data.PairList);
            expect($data.getJoinResultClass(StringPairList, StringDictionary))
                .toBe($data.StringPairList);
        });
    });

    describe("getMergeResultClass()", function () {
        it("should return merge result class", function () {
            expect($data.getMergeResultClass(StringCollection, Collection))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(StringCollection, StringCollection))
                .toBe($data.StringDictionary);
            expect($data.getMergeResultClass(StringCollection, Dictionary))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(StringCollection, StringDictionary))
                .toBe($data.StringDictionary);
            expect($data.getMergeResultClass(StringCollection, PairList))
                .toBe($data.PairList);
            expect($data.getMergeResultClass(StringCollection, StringPairList))
                .toBe($data.StringPairList);

            expect($data.getMergeResultClass(Collection, Collection))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(Collection, Dictionary))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(Collection, StringDictionary))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(Collection, PairList))
                .toBe($data.PairList);
            expect($data.getMergeResultClass(Collection, StringPairList))
                .toBe($data.PairList);

            expect($data.getMergeResultClass(StringDictionary, Dictionary))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(StringDictionary, StringDictionary))
                .toBe($data.StringDictionary);
            expect($data.getMergeResultClass(StringDictionary, PairList))
                .toBe($data.PairList);
            expect($data.getMergeResultClass(StringDictionary, StringPairList))
                .toBe($data.StringPairList);

            expect($data.getMergeResultClass(Dictionary, Dictionary))
                .toBe($data.Dictionary);
            expect($data.getMergeResultClass(Dictionary, PairList))
                .toBe($data.PairList);
            expect($data.getMergeResultClass(Dictionary, StringPairList))
                .toBe($data.PairList);

            expect($data.getMergeResultClass(StringPairList, PairList))
                .toBe($data.PairList);
            expect($data.getMergeResultClass(StringPairList, StringPairList))
                .toBe($data.StringPairList);

            expect($data.getMergeResultClass(PairList, PairList))
                .toBe($data.PairList);
        });
    });
});