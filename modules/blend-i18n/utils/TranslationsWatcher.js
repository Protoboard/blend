"use strict";

/**
 * @function $i18n.TranslationsWatcher.create
 * @returns {$i18n.TranslationsWatcher}
 */

/**
 * @class $i18n.TranslationsWatcher
 */
$i18n.TranslationsWatcher = $oop.getClass('$i18n.TranslationsWatcher')
.blend($oop.Singleton)
.define(/** @lends $i18n.TranslationsWatcher# */{
  /**
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onTranslationsFieldChange: function (event) {
    var translationsField = event.sender,
        localeDocumentKey = translationsField.entityKey.documentKey;

    return localeDocumentKey.toDocument()
    .trigger($i18n.EVENT_TRANSLATIONS_CHANGE);
  }
});

$event.EventSpace.create()
.on($entity.EVENT_ENTITY_CHANGE,
    $entity.FieldAttributePath.fromAttributeRef('_locale/translations')
    .unshift('entity').toString(),
    $i18n.TranslationsWatcher.__classId,
    function (event) {
      return $i18n.TranslationsWatcher.create().onTranslationsFieldChange(event);
    });
