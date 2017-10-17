"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * All classes indexed by class ID.
   * @type {object}
   * @todo Refactor class lookup to include an array too.
   */
  classByClassId: {},

  /**
   * Fetches the class by the specified ID. Creates the class if it doesn't
   * exist yet.
   * @param {string} classId
   * @returns {$oop.Class}
   */
  getClass: function (classId) {
    $assert.isString(classId, "No class ID was specified.");

    var classByClassId = $oop.classByClassId,
        Class = classByClassId[classId];

    if (!Class) {
      // class is not initialized yet
      Class = $oop.createObject($oop.Class, /** @lends $oop.Class# */{
        /**
         * Identifies class.
         * @type {string}
         */
        __classId: classId
      }, {
        writable: false,
        enumerable: true,
        configurable: false
      });

      $oop.copyProperties(Class, /** @lends $oop.Class# */{
        /**
         * Properties and methods contributed by the current class.
         * @type {object}
         * @private
         */
        __members: {},

        /**
         * Properties and methods delegated to the current class.
         * @type {object}
         * @private
         */
        __delegates: {},

        /**
         * Registry of interfaces implemented by the current class, and classes
         * implementing the current class as an interface.
         * @todo Add typedef
         * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
         * @private
         */
        __interfaces: {
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        },

        /**
         * Registry of classes mixed by the current class, and classes that mix
         * the current class.
         * @todo Add typedef
         * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
         * @private
         */
        __mixins: {
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        },

        /**
         * Registry of classes expected by the current class, and classes
         * requiring the current class.
         * @todo Add typedef
         * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
         * @private
         */
        __expected: {
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        },

        /**
         * Registry of classes that blend the current class. Blenders mix the
         * class and all its mixins.
         * @type {$oop.QuickList}
         * @private
         */
        __blenders: {list: [], lookup: {}},

        /**
         * Registry of methods not implemented by current class.
         * @type {$oop.QuickList}
         * @private
         */
        __missingMethodNames: {list: [], lookup: {}},

        /**
         * Registry of all classes contributing members to the current class.
         * **Order is important.**
         * @type {$oop.QuickList}
         * @private
         */
        __contributors: {list: [], lookup: {}},

        /**
         * Two dimensional lookup of methods contributed to the class. Indexed
         * by method name, then contributor index. (Index of contributor in
         * `__contributors.list`.)
         * **Order is important.**
         * @type {$oop.MemberMatrix}
         * @private
         */
        __methodMatrix: {},

        /**
         * Two dimensional lookup of properties contributed to the class.
         * Indexed by method name, then contributor index. (Index of
         * contributor in `__contributors.list`.)
         * **Order is important.**
         * @type {$oop.MemberMatrix}
         * @private
         */
        __propertyMatrix: {},

        /**
         * Registry of forward descriptors. Forwards define additional
         * mixins to be mixed to classes when initial properties meet the
         * specified condition.
         * @type {$oop.QuickList}
         * @private
         */
        __forwards: {
          list: [],
          sources: [],
          lookup: {}
        },

        /**
         * Hash function for caching instances.
         * @todo Rename?
         * @type {function}
         * @private
         */
        __mapper: undefined,

        /**
         * Lookup of cached instances indexed by hash.
         * @type {object}
         * @private
         */
        __instanceLookup: {}
      }, {
        writable: true,
        enumerable: false,
        configurable: true
      });

      // adding class to registry
      classByClassId[classId] = Class;
    }

    return Class;
  }
});
