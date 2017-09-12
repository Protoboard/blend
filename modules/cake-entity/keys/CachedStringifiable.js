"use strict";

/**
 * Caches the host class' instances by their stringified versions. Host must
 * implement {@link $utils.Stringifiable}.
 * @mixin $entity.CachedStringifiable
 * @todo Move to $utils
 */
$entity.CachedStringifiable = $oop.getClass('$entity.CachedStringifiable')
.cache(function (properties) {
  return this.toString.call(properties);
});
