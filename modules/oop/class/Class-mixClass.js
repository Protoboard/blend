"use strict";

$oop.copyProperties($oop.Class, /** @lends $oop.Class */{
  /**
   * Ad-hoc classes indexed by the class IDs of the mixins they're composed
   * of, in order of definition.
   * @type {object}
   */
  classByMixinIds: {},

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   * @todo Should be able to retrieve a regular class that mixes only.
   * (Eg. $data.StringCollection = $data.Collection + $data.StringValueHost.)
   */
  mixClass: function (Mixin) {
    var classByMixinIds = $oop.Class.classByMixinIds,
        Mixins = slice.call(arguments),
        // todo Should break down to atomic mixins
        path = Mixins.map(function (Mixin) {
          return Mixin.__classId;
        }),
        Class = $oop.getNode(classByMixinIds, path);

    if (!Class) {
      // class does not exist in index

      // creating class and adding mixins
      Class = $oop.getClass($oop.generateUuid());
      Mixins.forEach(function (Mixin) {
        Class.mix(Mixin);
      });

      // adding class to index
      $oop.setNode(classByMixinIds, path, Class);
    }

    return Class;
  }
});

/**
 * @function $oop.mixClass
 * @param {...$oop.Class} Mixin
 * @returns {$oop.Class}
 */
$oop.mixClass = function (Mixin) {
  return $oop.Class.mixClass.apply(null, arguments);
};
