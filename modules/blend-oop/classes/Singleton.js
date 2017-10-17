"use strict";

/**
 * Adds singleton behavior to host class.
 * @mixin $oop.Singleton
 * @example
 * var MySingletonClass = $oop.getClass('MySingletonClass')
 * .blend($oop.Singleton)
 */
$oop.Singleton = $oop.getClass('$oop.Singleton')
.cache(function () {
  return 'singleton';
});
