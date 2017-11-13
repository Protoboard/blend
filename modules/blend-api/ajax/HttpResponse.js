"use strict";

/**
 * @function $api.HttpResponse.create
 * @param {Object} properties
 * @param {*} properties.responseBody
 * @param {number} properties.httpStatus
 * @param {Object} properties.responseHeaders
 * @returns {$api.HttpResponse}
 */

/**
 * @class $api.HttpResponse
 * @extends $api.Response
 */
$api.HttpResponse = $oop.getClass('$api.HttpResponse')
.blend($oop.getClass('$api.Response'));

/**
 * @member {number} $api.HttpResponse#httpStatus
 */

/**
 * @member {Object} $api.HttpResponse#responseHeaders
 */
