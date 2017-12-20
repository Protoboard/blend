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
$api.XhrEvent = $oop.createClass('$api.XhrEvent')
.blend($api.ApiEvent)
.build();

/**
 * @member {XMLHttpRequest} $api.ApiEvent#xhr
 */

$api.ApiEvent
.forwardBlend($api.XhrEvent, function (properties) {
  var xhr = properties.xhr;
  return $utils.isBrowser() &&
      xhr instanceof XMLHttpRequest;
});
