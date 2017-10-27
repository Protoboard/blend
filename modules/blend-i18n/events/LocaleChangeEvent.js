"use strict";

/**
 * @function $i18n.LocaleChangeEvent.create
 * @returns {$i18n.LocaleChangeEvent}
 */

/**
 * @class $i18n.LocaleChangeEvent
 * @extends $event.Event
 */
$i18n.LocaleChangeEvent = $oop.getClass('$i18n.LocaleChangeEvent')
.blend($event.Event);

/**
 * @member {$i18n.Locale} $i18n.LocaleChangeEvent#localeBefore
 */

/**
 * @member {$i18n.Locale} $i18n.LocaleChangeEvent#localeAfter
 */

$event.Event
.forwardBlend($i18n.LocaleChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'i18n.change.locale');
});
