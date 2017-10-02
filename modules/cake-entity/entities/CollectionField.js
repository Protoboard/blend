"use strict";

/**
 * @function $entity.CollectionField.create
 * @returns {$entity.CollectionField}
 */

/**
 * @class $entity.CollectionField
 * @extends $entity.Field
 * @extends $entity.BranchNodeEntity
 * @mixes $entity.ShallowEntityChangeEventSpawner
 */
$entity.CollectionField = $oop.getClass('$entity.CollectionField')
.mix($oop.getClass('$entity.Field'))
.mix($oop.getClass('$entity.BranchNodeEntity'))
.mix($oop.getClass('$entity.ShallowEntityChangeEventSpawner'));

$oop.getClass('$entity.Field')
.forwardTo(
    $entity.CollectionField,
    function (properties) {
      var fieldKey = properties && properties.entityKey;
      return fieldKey &&
          // todo These two should be separate using .forwardMix()
          fieldKey.getNodeType() === 'branch' &&
          fieldKey.getValueType() === 'collection';
    });