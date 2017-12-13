"use strict";

/**
 * Caches the host class' instances by their stringified versions. Host must
 * implement {@link $utils.Stringifiable}.
 * @mixin $utils.StringifyCached
 */
$utils.StringifyCached = $oop.createClass('$utils.StringifyCached')
.cacheBy(function (properties) {
  return this.toString.call(properties);
})
.build();
