"use strict";

/**
 * Caches the host class' instances by their stringified versions. Host must
 * implement {@link $utils.Stringifiable}.
 * @mixin $utils.StringifyCached
 */
$utils.StringifyCached = $oop.getClass('$utils.StringifyCached')
.cache(function (properties) {
  return this.toString.call(properties);
});
