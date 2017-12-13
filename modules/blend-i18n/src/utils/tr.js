"use strict";

$oop.copyProperties($i18n, /** @lends $i18n */{
  /**
   * Gettext-compatible shorthand for specifying translatable strings.
   * @link https://www.npmjs.com/package/grunt-xgettext
   * @param {string} singular
   * @param {string} [plural]
   * @param {number} [count]
   * @param {Object} [options]
   * @param {string} [options.context]
   * @param {string} [options.comment]
   * @returns {$i18n.Translatable}
   * @todo Make use of `plural`
   */
  tr: function (singular, plural, count, options) {
    //plural = typeof plural === 'string' ? plural : undefined;
    count = typeof count === 'number' ? count : undefined;

    var argc = arguments.length,
        i;
    for (i = 0; i < argc; i++) {
      if (arguments[i] instanceof Object) {
        options = arguments[i];
      }
    }

    return $i18n.Translatable.create({
      originalString: singular,
      count: count,
      context: options && options.context
    });
  }
});
