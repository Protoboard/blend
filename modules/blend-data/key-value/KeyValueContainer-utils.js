"use strict";

$oop.copyProperties($data, /** @lends $data */{
  /**
   * Maps all `KeyValueContainer`-based classes based on their distinctive
   * properties: *key type*, *value type*, and *key multiplicity*.
   * @constant
   */
  CLASS_BY_TYPE: {
    string: { // $data.KEY_TYPE_STRING
      string: { // $data.VALUE_TYPE_STRING
        unique: $data.StringCollection,
        undefined: $data.StringDictionary
      },
      undefined: { // $data.VALUE_TYPE_ANY
        unique: $data.Collection,
        undefined: $data.Dictionary
      }
    },
    undefined: { // $data.KEY_TYPE_ANY
      string: { // $data.VALUE_TYPE_STRING
        unique: $data.StringPairList,
        undefined: $data.StringPairList
      },
      undefined: { // $data.VALUE_TYPE_ANY
        unique: $data.PairList,
        undefined: $data.PairList
      }
    }
  },

  /**
   * Determines what `KeyValueContainer` class will be the result of mapping
   * the specified container class using the specified types.
   * @param {$data.KeyValueContainer} SourceClass KeyValueContainer class to be
   *     mapped.
   * @param {string} [keyType] Key type of result. Defaults to the source's key
   *     type.
   * @param {string} [valueType] Value type of result. Default to the source's
   *     value type.
   * @returns {$data.KeyValueContainer}
   */
  getMapResultClass: function (SourceClass, keyType, valueType) {
    return $data.CLASS_BY_TYPE
        [keyType || SourceClass.keyType]
        [valueType || SourceClass.valueType]
        [SourceClass.keyMultiplicity];
  },

  /**
   * Determines what `KeyValueContainer` class will be the result of swapping
   * the specified `KeyValueContainer` class.
   * @param {$data.KeyValueContainer} SourceClass KeyValueContainer class the
   *     keys & values of which to be swapped.
   * @returns {$data.KeyValueContainer}
   */
  getSwapResultClass: function (SourceClass) {
    return $data.CLASS_BY_TYPE
        [SourceClass.valueType] // value type will be the new key type
        [SourceClass.keyType] // key type will be the new value type
        [$data.KEY_MUL_ANY]; // we can't know if keys remain unique
  },

  /**
   * Determines what `KeyValueContainer` class will be the result of joining
   * `LeftClass` & `RightClass`.
   * @param {$data.KeyValueContainer} LeftClass Class of left operand in join
   * @param {$data.KeyValueContainer} RightClass Class of right operand in join
   * @returns {$data.KeyValueContainer}
   */
  getJoinResultClass: function (LeftClass, RightClass) {
    var keyMultiplicity;

    if (LeftClass.valueType === $data.VALUE_TYPE_STRING &&
        RightClass.keyType === $data.KEY_TYPE_STRING
    ) {
      keyMultiplicity = LeftClass.keyMultiplicity === RightClass.keyMultiplicity ?
          LeftClass.keyMultiplicity :
          $data.KEY_MUL_ANY;

      return $data.CLASS_BY_TYPE
          [LeftClass.keyType]
          [RightClass.valueType]
          [keyMultiplicity];
    }
  },

  /**
   * Determines what `KeyValueContainer` class will be the result of merging
   * `LeftClass` & `RightClass`.
   * @param {$data.KeyValueContainer} LeftClass Class of left operand in merge
   * @param {$data.KeyValueContainer} RightClass Class of right operand in merge
   * @returns {$data.KeyValueContainer}
   */
  getMergeResultClass: function (LeftClass, RightClass) {
    var resultKeyType = LeftClass.keyType === RightClass.keyType ?
        LeftClass.keyType :
        $data.KEY_TYPE_ANY,
        resultValueType = LeftClass.valueType === RightClass.valueType ?
            LeftClass.valueType :
            $data.VALUE_TYPE_ANY;

    return $data.CLASS_BY_TYPE
        [resultKeyType]
        [resultValueType]
        [$data.KEY_MUL_ANY];
  }
});