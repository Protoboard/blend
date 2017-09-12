"use strict";

/**
 * @function $entity.MetaKey.create
 * @returns {$entity.MetaKey}
 */

/**
 * @mixin $entity.MetaKey
 * @augments $entity.EntityKey
 * @todo Rename to StaticKey / StaticEntityKey
 */
$entity.MetaKey = $oop.getClass('$entity.MetaKey')
.cache(function (properties) {
  return this.toString.call(properties);
})
.expect($entity.EntityKey);
