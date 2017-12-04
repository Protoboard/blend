"use strict";

/**
 * Adds singleton behavior to host class.
 * @mixin $oop.Singleton
 * @extends $oop.Klass
 * @example
 * var MySingletonClass = $oop.createClass('MySingletonClass')
 * .blend($oop.Singleton)
 */
$oop.Singleton = $oop.createClass('$oop.Singleton')
.cacheBy(function () {
  return 'singleton';
})
.build();
