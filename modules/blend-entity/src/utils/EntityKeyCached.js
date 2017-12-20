"use strict";

/**
 * Caches the host class' instances by their entityKey property. Host must
 * als mix {@link $entity.EntityKeyHost}.
 * @mixin $entity.EntityKeyCached
 * @augments $entity.EntityKeyHost
 */
$entity.EntityKeyCached = $oop.createClass('$entity.EntityKeyCached')
.cacheBy(function (properties) {
  var entityKey = properties.entityKey;
  return entityKey && entityKey.toString();
})
.expect($entity.EntityKeyHost)
.build();
