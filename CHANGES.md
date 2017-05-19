GIANT 0.4.0 -> 0.5.0 Migration Guide
====================================
 
Assert
------

- $assert.hasValue -> $assert.isDefined
- $assert.isJQuery -> -
- $assert.isJQueryOptional -> -
- $assert.isPlainObject -> -
- $assertion -> $assert

OOP
---

- $oop.addGlobalConstants -> $oop.copyProperties
- $oop.addGlobalFunctions -> $oop.copyProperties

Utils
-----

- $utils.Stringifier.stringify -> $utils.stringify
- Array#toUriDecoded -> -
- Array#toUriEncoded -> -

### Keep?

- $utils.StringUtils.escapeChars -> -
- $utils.StringUtils.padLeft -> -
- $utils.StringUtils.safeSplit -> -
- $utils.StringUtils.unescapeChars -> -
 
Data
----

- $data.Collection#asType -> -
- $data.Collection#createWithEachItem -> #createWithEachValue
- $data.Collection#deleteItem -> $data.KeyValueStore#deleteKey
- $data.Collection#filterByPrefix -> #filterByKeyPrefix
- $data.Collection#filterByRegExp -> #filterByKeyKeyRegExp
- $data.Collection#filterBySelector -> #filterBy
- $data.Collection#getKeysByPrefix -> -
- $data.Collection#getKeysByPrefixAsHash -> -
- $data.Collection#getKeysByRegExp -> -
- $data.Collection#getKeysByRegExpAsHash -> -
- $data.Collection#getSortedValues -> -
- $data.Collection#getSortedValuesAsHash -> -
- $data.Collection#mapKeys -> $data.Dictionary#mapKeys
- $data.Collection#passEachItemTo -> #passEachValueTo
- $data.Collection#setItem -> $data.KeyValueStore#setValue
- $data.DataUtils.isEmptyObject -> $oop.isEmptyObject
- $data.DataUtils.isSingularObject -> $oop.isSingularObject
- $data.DataUtils.shallowCopy -> $oop.shallowCopy
- $data.Hash -> $data.KeyValueStore
- $data.Hash#changeBufferTypeTo -> -
- $data.Hash#getItem -> $data.KeyValueStore#getValue
- $data.Hash#getKeysAsHash -> -
- $data.Hash#getValuesAsHash -> -
- $data.Hash#items -> $data.Buffer#_data
- $data.Hash#keyCount -> $data.Buffer#_keyCount
- $data.Hash#passItemsTo -> $data.Buffer#passItemsTo
- $data.Hash#passSelfTo -> $data.Buffer#passSelfTo
- $data.Set#differenceWith -> #takeDifferenceWith
- $data.Set#unionWith -> #uniteWith
- Array#toHash -> Array#toKeyValueStore
