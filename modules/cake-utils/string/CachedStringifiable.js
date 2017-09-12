"use strict";

/**
 * Caches the host class' instances by their stringified versions. Host must
 * implement {@link $utils.Stringifiable}.
 * @mixin $utils.CachedStringifiable
 * @todo Rename to StringifyCached
 */
$utils.CachedStringifiable = $oop.getClass('$utils.CachedStringifiable')
.cache(function (properties) {
  return this.toString.call(properties);
});
