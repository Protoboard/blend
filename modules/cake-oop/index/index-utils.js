"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * @param {$oop.QuickListLookup} quickListLookup
   * @param {string} key
   * @returns {$oop.QuickList}
   */
  getSafeQuickList: function (quickListLookup, key) {
    var quickList = quickListLookup[key];
    if (!quickList) {
      quickListLookup[key] = quickList = {
        list: [],
        lookup: {}
      };
    }
    return quickList;
  }
});