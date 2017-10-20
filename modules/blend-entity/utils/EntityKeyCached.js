"use strict";

/**
 * Caches the host class' instances by their entityKey property. Host must
 * als mix {@link $entity.EntityKeyHost}.
 * @mixin $entity.EntityKeyCached
 * @augments $entity.EntityKeyHost
 */
$entity.EntityKeyCached = $oop.getClass('$entity.EntityKeyCached')
.cache(function (properties) {
  var entityKey = properties && properties.entityKey;
  return entityKey && entityKey.toString();
})
.expect($oop.getClass('$entity.EntityKeyHost'));