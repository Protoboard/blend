"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Generates RFC-compliant, but not cryptographic quality UUID. Readable
   * implementation, rather than fast. Used in generating class IDs for
   * ad-hoc classes.
   * @returns {string}
   * @see https://stackoverflow.com/a/2117523/375073
   */
  generateUuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ?
              r :
              (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
});
