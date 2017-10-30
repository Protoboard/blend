"use strict";

/**
 * @function $i18n.Locale.create
 * @param {Object} properties
 * @param {$entity.DocumentKey} properties.localeKey
 * @returns {$i18n.Locale}
 */

/**
 * @class $i18n.Locale
 * @extend $event.EventSender
 * @extend $event.EventListener
 */
$i18n.Locale = $oop.getClass('$i18n.Locale')
.cache(function (properties) {
  var localeKey = properties && properties.localeKey;
  return localeKey && localeKey.toString();
})
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $i18n.Locale# */{
  /**
   * @member {$entity.DocumentKey} $i18n.Locale#localeKey
   */

  /**
   * @memberOf $i18n.Locale
   * @param {$entity.DocumentKey} localeKey
   * @returns {$i18n.Locale}
   */
  fromLocaleKey: function (localeKey) {
    return this.create({localeKey: localeKey});
  },

  /**
   * @memberOf $i18n.Locale
   * @param {string} localeId
   * @returns {$i18n.Locale}
   */
  fromLocaleId: function (localeId) {
    var localeKey = $entity.DocumentKey.fromComponents('_locale', localeId);
    return this.create({localeKey: localeKey});
  },

  /** @ignore */
  init: function () {
    var localeKey = this.localeKey;

    $assert.isDocumentKey(localeKey, "Invalid locale key");

    var localeId = localeKey.documentId,
        listeningPath = $data.Path.fromComponentsToString(['locale', localeId]);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath);
  },

  /**
   * Retrieves translation for specified `originalString`, `context`, and
   * `multiplicity` in the current locale.
   * @param {string} originalString
   * @param {string} context
   * @param {number} multiplicity
   * @returns {string}
   * @todo Accept Stringifiable for originalString?
   */
  getTranslation: function (originalString, context, multiplicity) {
    var localeDocument = this.localeKey.toDocument(),
        localeName = localeDocument.getLocaleName(),
        pluralIndex; // todo

    return $i18n.TranslationIndex.create()
    .getTranslation(localeName, originalString, context, pluralIndex);
  },

  /**
   * Sets current locale as active locale.
   * @returns {$i18n.Locale}
   */
  setAsActiveLocale: function () {
    $i18n.LocaleEnvironment.create().setActiveLocale(this);
    return this;
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$i18n.Locale}
   */
  toLocale: function () {
    return $i18n.Locale.fromLocaleId(this.valueOf());
  }
});
