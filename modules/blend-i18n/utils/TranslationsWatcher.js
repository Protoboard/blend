"use strict";

/**
 * @function $i18n.TranslationsWatcher.create
 * @returns {$i18n.TranslationsWatcher}
 */

/**
 * @class $i18n.TranslationsWatcher
 * @extends $event.EventListener
 * @extends $event.EventSubscriber
 * @implements $utils.Destructible
 */
$i18n.TranslationsWatcher = $oop.getClass('$i18n.TranslationsWatcher')
.blend($oop.Singleton)
.blend($event.EventListener)
.blend($event.EventSubscriber)
.implement($utils.Destructible)
.define(/** @lends $i18n.TranslationsWatcher# */{
  /** @ignore */
  spread: function () {
    this.subscriberId = this.__classId;
    this.listeningPath = 'entity.document.__field._locale/translations';
  },

  /** @ignore */
  init: function () {
    this.on($entity.EVENT_ENTITY_CHANGE, this, this.onTranslationsChange);
  },

  /**
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onTranslationsChange: function (event) {
    var translationsField = event.sender,
        localeDocumentKey = translationsField.entityKey.documentKey;

    return localeDocumentKey.toDocument()
    .trigger($i18n.EVENT_TRANSLATIONS_CHANGE);
  }
});

$oop.copyProperties($i18n, /** @lends $i18n */{
  /**
   * Signals that translations associated with a locale have changed.
   * @constant
   */
  EVENT_TRANSLATIONS_CHANGE: 'i18n.change.translations'
});