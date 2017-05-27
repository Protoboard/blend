/* globals $oop */
"use strict";

$oop.copyProperties(exports, /** @lends $data */{
    /** @constant */
    MAP_RESULT_CLASS: {
        VALUE: {
            STRING: {
                '$data.Collection': $oop.getClass('$data.StringCollection'),
                '$data.StringCollection': $oop.getClass('$data.StringCollection'),
                '$data.Dictionary': $oop.getClass('$data.StringDictionary'),
                '$data.StringDictionary': $oop.getClass('$data.StringDictionary'),
                '$data.PairList': $oop.getClass('$data.StringPairList'),
                '$data.StringPairList': $oop.getClass('$data.StringPairList')
            },
            ANY: {
                '$data.Collection': $oop.getClass('$data.Collection'),
                '$data.StringCollection': $oop.getClass('$data.Collection'),
                '$data.Dictionary': $oop.getClass('$data.Dictionary'),
                '$data.StringDictionary': $oop.getClass('$data.Dictionary'),
                '$data.PairList': $oop.getClass('$data.PairList'),
                '$data.StringPairList': $oop.getClass('$data.PairList')
            }
        },
        KEY: {
            STRING: {
                '$data.Collection': $oop.getClass('$data.Collection'),
                '$data.StringCollection': $oop.getClass('$data.StringCollection'),
                '$data.Dictionary': $oop.getClass('$data.Dictionary'),
                '$data.StringDictionary': $oop.getClass('$data.StringDictionary'),
                '$data.PairList': $oop.getClass('$data.Dictionary'),
                '$data.StringPairList': $oop.getClass('$data.StringDictionary')
            },
            ANY: {
                '$data.Collection': $oop.getClass('$data.PairList'),
                '$data.StringCollection': $oop.getClass('$data.StringPairList'),
                '$data.Dictionary': $oop.getClass('$data.PairList'),
                '$data.StringDictionary': $oop.getClass('$data.StringPairList'),
                '$data.PairList': $oop.getClass('$data.PairList'),
                '$data.StringPairList': $oop.getClass('$data.StringPairList')
            }
        },

        /**
         * For key-value at once.
         * TODO: Implement
         */
        BOTH: {
            STRING_STRING: {},
            STRING_ANY: {},
            ANY_STRING: {},
            ANY_ANY: {}
        }
    },

    /** @constant */
    SWAP_RESULT_CLASS: {
        '$data.Collection': $oop.getClass('$data.StringPairList'),
        '$data.StringCollection': $oop.getClass('$data.StringDictionary'),
        '$data.Dictionary': $oop.getClass('$data.StringPairList'),
        '$data.StringDictionary': $oop.getClass('$data.StringDictionary'),
        '$data.PairList': $oop.getClass('$data.PairList'),
        '$data.StringPairList': $oop.getClass('$data.StringDictionary')
    },

    /** @constant */
    JOIN_RESULT_CLASS: {
        '$data.StringCollection': {
            '$data.Collection': $oop.getClass('$data.Collection'),
            '$data.StringCollection': $oop.getClass('$data.StringCollection'),
            '$data.Dictionary': $oop.getClass('$data.Dictionary'),
            '$data.StringDictionary': $oop.getClass('$data.StringDictionary')
        },
        '$data.StringDictionary': {
            '$data.Collection': $oop.getClass('$data.Dictionary'),
            '$data.StringCollection': $oop.getClass('$data.StringDictionary'),
            '$data.Dictionary': $oop.getClass('$data.Dictionary'),
            '$data.StringDictionary': $oop.getClass('$data.StringDictionary')
        },
        '$data.StringPairList': {
            '$data.Collection': $oop.getClass('$data.PairList'),
            '$data.StringCollection': $oop.getClass('$data.StringPairList'),
            '$data.Dictionary': $oop.getClass('$data.PairList'),
            '$data.StringDictionary': $oop.getClass('$data.StringPairList')
        }
    },

    /**
     * @param {$oop.Class} SourceClass
     * @param {string} [side='VALUE']
     * @param {string} [sideType='ANY']
     * @returns {$oop.Class}
     */
    getMapResultClass: function (SourceClass, side, sideType) {
        side = side || 'VALUE';
        sideType = sideType || 'ANY';
        return exports.MAP_RESULT_CLASS[side][sideType][SourceClass.__classId];
    },

    /**
     * @param {$oop.Class} SourceClass
     * @returns {$oop.Class}
     */
    getSwapResultClass: function (SourceClass) {
        return exports.SWAP_RESULT_CLASS[SourceClass.__classId];
    },

    /**
     * @param {$oop.Class} LeftClass
     * @param {$oop.Class} RightClass
     * @returns {$oop.Class}
     */
    getJoinResultClass: function (LeftClass, RightClass) {
        return exports.SWAP_RESULT_CLASS[LeftClass.__classId][RightClass.__classId];
    }
});