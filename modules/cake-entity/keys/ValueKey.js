"use strict";

/**
 * Marks entity keys that identify value nodes in the entity store.
 * @mixin $entity.ValueKey
 * @augments $entity.EntityKey
 */
$entity.ValueKey = $oop.getClass('$entity.ValueKey')
.expect($oop.getClass('$entity.EntityKey'));

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$entity.ValueKey} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isValueKey: function (expr, message) {
    return $assert.assert(
        $entity.ValueKey.mixedBy(expr), message);
  },

  /**
   * @param {$entity.ValueKey} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isValueKeyOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $entity.ValueKey.mixedBy(expr), message);
  }
});
