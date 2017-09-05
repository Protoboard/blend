"use strict";

/**
 * @function $entity.Field.create
 * @returns {$entity.Field}
 */

/**
 * @class $entity.Field
 * @extends $entity.Entity
 */
$entity.Field = $oop.getClass('$entity.Field')
.mix($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.Field# */{
  /**
   * @inheritDoc
   * @member {$entity.FieldKey} $entity.Field#entityKey
   */

  /** @ignore */
  spread: function () {
    var fieldKey = this.entityKey,
        metaKey = fieldKey.getMetaKey(),
        fieldEventPath = fieldKey.getEntityPath().unshift('entity'),
        metaEventPath = metaKey.getEntityPath().unshift('entity');

    this.listeningPath = fieldEventPath;

    this.triggerPaths = [
      fieldEventPath,
      // todo We'll need field type path here
      metaEventPath
    ];
  }

  ///** @ignore */
  //getItem: function (itemId) {
  //  $entity.Item.fromEntityKey(this.entityKey.getItemKey(itemId));
  //}
});
