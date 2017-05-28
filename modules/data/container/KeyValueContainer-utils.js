/* globals $oop */
"use strict";

$oop.copyProperties(exports, /** @lends $data */{
    /** @constant */
    CLASS_BY_TYPE: {
        string: {
            string: {
                unique: $oop.getClass('$data.StringCollection'),
                undefined: $oop.getClass('$data.StringDictionary')
            },
            undefined: {
                unique: $oop.getClass('$data.Collection'),
                undefined: $oop.getClass('$data.Dictionary')
            }
        },
        undefined: {
            string: {
                unique: $oop.getClass('$data.StringPairList'),
                undefined: $oop.getClass('$data.StringPairList')
            },
            undefined: {
                unique: $oop.getClass('$data.PairList'),
                undefined: $oop.getClass('$data.PairList')
            }
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
     * @param {$data.KeyValueContainer} SourceClass
     * @param {string} [keyType]
     * @param {string} [valueType]
     * @returns {$data.KeyValueContainer}
     */
    getMapResultClass: function (SourceClass, keyType, valueType) {
        keyType = keyType || SourceClass.keyType;
        valueType = valueType || SourceClass.valueType;

        return exports.CLASS_BY_TYPE[keyType][valueType][SourceClass.keyMultiplicity];
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