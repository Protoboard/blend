"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * @param {$oop.QuickListLookup} index
   * @param {string} key
   * @returns {$oop.QuickList}
   */
  getSafeIndexEntry: function (index, key) {
    var indexEntry = index[key];
    if (!indexEntry) {
      index[key] = indexEntry = {
        list: [],
        lookup: {}
      };
    }
    return indexEntry;
  }
});