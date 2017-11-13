"use strict";

/**
 * @function $i18n.Translatable.create
 * @param {Object} properties
 * @param {string|$utils.Stringifiable} properties.string
 * @param {number} [properties.count]
 * @param {string} [properties.context]
 * @returns {$i18n.Translatable}
 */

/**
 * Resolves to translation based on an original string and accompanying
 * properties. (Context & count)
 * @class $i18n.Translatable
 * @implements $utils.Stringifiable
 */
$i18n.Translatable = $oop.getClass('$i18n.Translatable')
.implement($utils.Stringifiable)
.define(/** @lends $i18n.Translatable# */{
  /**
   * Original string for the translation. Expected to be unique within context.
   * @member {string|$utils.Stringifiable} $i18n.Translatable#originalString
   */

  /**
   * Context the translation is associated with. Serves as basis for
   * disambiguation.
   * @member {string} $i18n.Translatable#context
   */

  /**
   * Count associated with translation, if applicable.
   * @member {number} $i18n.Translatable#count
   */

  /**
   * @memberOf $i18n.Translatable
   * @param {string|$utils.Stringifiable} string
   * @param {Object} [properties]
   * @returns {$i18n.Translatable}
   */
  fromString: function (string, properties) {
    return this.create({
      originalString: string
    }, properties);
  },

  /** @ignore */
  defaults: function () {
    this.context = this.context || null;
    this.count = this.count === undefined ?
        1 :
        this.count;
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.originalString, "Invalid original string");
  },

  /**
   * @param {number} count
   * @returns {$i18n.Translatable}
   */
  setCount: function (count) {
    this.count = count;
    return this;
  },

  /**
   * @param {string} context
   * @returns {$i18n.Translatable}
   */
  setContext: function (context) {
    this.context = context;
    return this;
  },

  /**
   * @returns {string}
   */
  toString: function () {
    var originalString = $utils.stringify(this.originalString),
        localeEnvironment = $i18n.LocaleEnvironment.create(),
        activeLocale = localeEnvironment.getActiveLocale();

    return activeLocale &&
        activeLocale.getTranslation(originalString, this.context, this.count) ||
        originalString;
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$i18n.Translatable}
   */
  toTranslatable: function (properties) {
    return $i18n.Translatable.fromString(this.valueOf(), properties);
  }
});
