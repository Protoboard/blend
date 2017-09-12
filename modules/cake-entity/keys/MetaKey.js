"use strict";

/**
 * @function $entity.MetaKey.create
 * @returns {$entity.MetaKey}
 */

/**
 * @mixin $entity.MetaKey
 * @augments $entity.EntityKey
 * @todo Remove EntityKey dependency, rename to StringCached and move to $utils
 */
$entity.MetaKey = $oop.getClass('$entity.MetaKey')
.cache(function (properties) {
  return this.toString.call(properties);
})
.expect($entity.EntityKey);
