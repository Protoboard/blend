/* globals $oop */
"use strict";

$oop.copyProperties(exports, /** @lends $data */{
    /** @constant */
    CLASS_BY_TYPE: {
        KEY_TYPE_STRING: {
            VALUE_TYPE_STRING: {
                KEY_MUL_UNIQUE: $oop.getClass('$data.StringCollection'),
                KEY_MUL_ANY: $oop.getClass('$data.StringDictionary')
            },
            VALUE_TYPE_ANY: {
                KEY_MUL_UNIQUE: $oop.getClass('$data.Collection'),
                KEY_MUL_ANY: $oop.getClass('$data.Dictionary')
            }
        },
        KEY_TYPE_ANY: {
            VALUE_TYPE_STRING: {
                KEY_MUL_UNIQUE: $oop.getClass('$data.StringPairList'),
                KEY_MUL_ANY: $oop.getClass('$data.StringPairList')
            },
            VALUE_TYPE_ANY: {
                KEY_MUL_UNIQUE: $oop.getClass('$data.PairList'),
                KEY_MUL_ANY: $oop.getClass('$data.PairList')
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
     * @param {string} [resultType='VALUE_TYPE_STRING']
     * @returns {$data.KeyValueContainer}
     */
    getMapResultClass: function (SourceClass, resultType) {
        resultType = resultType || exports.VALUE_TYPE_STRING;

        var sourceKeyType = SourceClass.keyType,
            sourceValueType = SourceClass.valueType,
            sourceKeyMultiplicity = SourceClass.keyMultiplicity,
            resultKeyType = exports.KEY_TYPES[resultType] || sourceKeyType,
            resultValueType = exports.VALUE_TYPES[resultType] || sourceValueType;

        return exports.CLASS_BY_TYPE[resultKeyType][resultValueType][sourceKeyMultiplicity];
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