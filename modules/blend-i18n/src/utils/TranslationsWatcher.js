"use strict";

/**
 * @function $i18n.TranslationsWatcher.create
 * @returns {$i18n.TranslationsWatcher}
 */

/**
 * Listens to events originating from `_locale/translations` collection and
 * triggers appropriate high-level events on affected `Locale` instances.
 * @class $i18n.TranslationsWatcher
 */
$i18n.TranslationsWatcher = $oop.createClass('$i18n.TranslationsWatcher')
.blend($oop.Singleton)
.define(/** @lends $i18n.TranslationsWatcher# */{
  /**
   * @param {$entity.EntityChangeEvent} event
   * @returns {$utils.Promise}
   * @ignore
   */
  onTranslationsFieldChange: function (event) {
    var translationsField = event.sender,
        localeKey = translationsField.entityKey.parentKey;

    return $i18n.Locale.fromLocaleKey(localeKey)
    .trigger($i18n.EVENT_TRANSLATIONS_CHANGE);
  },

  /**
   * @param {$event.Event} event
   * @returns {$utils.Promise}
   * @ignore
   */
  onTranslationsFieldAbsent: function (event) {
    var translationsField = event.sender,
        localeKey = translationsField.entityKey.parentKey;

    return $i18n.Locale.fromLocaleKey(localeKey)
    .trigger($i18n.EVENT_TRANSLATIONS_ABSENT);
  }
})
.build();

$event.EventSpace.create()
.on($entity.EVENT_ENTITY_CHANGE,
    $entity.FieldAttributePath.fromAttributeRef('_locale/translations')
    .unshift('entity').toString(),
    $i18n.TranslationsWatcher.__className,
    function (event) {
      return $i18n.TranslationsWatcher.create()
      .onTranslationsFieldChange(event);
    })
.on($entity.EVENT_ENTITY_ABSENT,
    $entity.FieldAttributePath.fromAttributeRef('_locale/translations')
    .unshift('entity').toString(),
    $i18n.TranslationsWatcher.__className,
    function (event) {
      return $i18n.TranslationsWatcher.create()
      .onTranslationsFieldAbsent(event);
    });
