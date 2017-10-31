"use strict";

/**
 * @function $i18n.LocaleEnvironment.create
 * @returns {$i18n.LocaleEnvironment}
 */

/**
 * @class $i18n.LocaleEnvironment
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$i18n.LocaleEnvironment = $oop.getClass('$i18n.LocaleEnvironment')
.blend($oop.Singleton)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $i18n.LocaleEnvironment# */{
  /**
   * @member {$entity.DocumentKey} $i18n.LocaleEnvironment#localeEnvironmentKey
   */

  /** @ignore */
  init: function () {
    this.localeEnvironmentKey = $entity.DocumentKey.fromString('_localeEnvironment/');

    this
    .setListeningPath('locale')
    .addTriggerPath('locale');
  },

  /**
   * @param {$i18n.Locale} locale
   * @returns {$i18n.LocaleEnvironment}
   */
  setActiveLocale: function (locale) {
    var localeKey = locale.localeKey,
        localeEnvironmentDocument = this.localeEnvironmentKey.toDocument();
    localeEnvironmentDocument.setActiveLocaleKey(localeKey);
    return this;
  },

  /**
   * @returns {$i18n.Locale}
   */
  getActiveLocale: function () {
    var localeEnvironmentDocument = this.localeEnvironmentKey.toDocument(),
        activeLocaleKey = localeEnvironmentDocument.getActiveLocaleKey();
    return activeLocaleKey && $i18n.Locale.fromLocaleKey(activeLocaleKey);
  },

  /**
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onActiveLocaleFieldChange: function (event) {
    var localeRefBefore = event.nodeBefore,
        localeKeyBefore = localeRefBefore && $entity.DocumentKey.fromString(localeRefBefore),
        localeRefAfter = event.nodeAfter,
        localeKeyAfter = localeRefAfter && $entity.DocumentKey.fromString(localeRefAfter);

    return this.spawnEvent({
      eventName: $i18n.EVENT_LOCALE_CHANGE,
      localeBefore: localeKeyBefore && $i18n.Locale.fromLocaleKey(localeKeyBefore),
      localeAfter: localeKeyAfter && $i18n.Locale.fromLocaleKey(localeKeyAfter)
    })
    .trigger();
  }
});

$event.EventSpace.create()
.on($entity.EVENT_ENTITY_CHANGE,
    $entity.FieldAttributePath.fromAttributeRef('_localeEnvironment/activeLocale')
    .unshift('entity').toString(),
    $i18n.LocaleEnvironment.__classId,
    function (event) {
      return $i18n.LocaleEnvironment.create().onActiveLocaleFieldChange(event);
    });
