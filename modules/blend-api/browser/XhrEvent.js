"use strict";

/**
 * @function $api.XhrEvent.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @param {$api.Request} properties.request
 * @param {$api.Response} properties.response
 * @param {XMLHttpRequest} properties.xhr
 * @returns {$api.XhrEvent}
 */

/**
 * @class $api.XhrEvent
 * @extends $api.ApiEvent
 */
$api.XhrEvent = $oop.getClass('$api.XhrEvent')
.blend($oop.getClass('$api.ApiEvent'));

/**
 * @member {XMLHttpRequest} $api.ApiEvent#xhr
 */

$oop.getClass('$api.ApiEvent')
.forwardBlend($api.XhrEvent, function (properties) {
  var xhr = properties && properties.xhr;
  return $utils.isBrowser() &&
      xhr instanceof XMLHttpRequest;
});
