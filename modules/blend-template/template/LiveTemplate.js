"use strict";

/**
 * @function $template.LiveTemplate.create
 * @param {object} properties
 * @param {string|$utils.Stringifiable} properties.templateString
 * @returns {$template.LiveTemplate}
 */

/**
 * @class $template.LiveTemplate
 * @extends $template.Template
 * @mixes $utils.Identifiable
 * @extends $event.EventSender
 * @extends $event.EventListener
 * @implements $utils.Stringifiable
 */
$template.LiveTemplate = $oop.getClass('$template.LiveTemplate')
.blend($oop.getClass('$template.Template'))
.blend($utils.Identifiable)
.blend($event.EventSender)
.blend($event.EventListener)
.implement($utils.Stringifiable)
.define(/** @lends $template.LiveTemplate# */{
  /**
   * @member {Object} $template.LiveTemplate#parameterValues
   */

  /** @ignore */
  init: function () {
    var listeningPath = $data.Path.fromComponents([
      'template', String(this.instanceId)]);

    this.setListeningPath(listeningPath);

    this
    .addTriggerPath(listeningPath)
    .addTriggerPath($data.Path.fromString('template'));

    this.parameterValues = this.parameterValues || {};
  },

  /**
   * @param {Object} result
   * @param {Object} parameterValues
   * @returns {Object}
   * @private
   */
  _mergeParameters: function (result, parameterValues) {
    var parameterNames = Object.keys(parameterValues),
        parameterCount = parameterNames.length,
        i, parameterName, parameterValue;

    for (i = 0; i < parameterCount; i++) {
      parameterName = parameterNames[i];
      parameterValue = parameterValues[parameterName];

      if ($template.LiveTemplate.mixedBy(parameterValue)) {
        result[parameterName] = parameterValue.templateString;
        this._mergeParameters(result, parameterValue.parameterValues);
      } else {
        result[parameterName] = parameterValue;
      }
    }

    return result;
  },

  /**
   * @param {Object} parameterValues
   * @returns {$template.LiveTemplate}
   */
  setParameterValues: function (parameterValues) {
    var parameterValuesAfter = this._mergeParameters({}, parameterValues),
        parameterValuesBefore = $data.Collection.fromData(parameterValuesAfter)
        .mapValues(function (values, keys) {
          return keys;
        })
        .asStringCollection()
        .join($data.Collection.fromData(this.parameterValues))
            .data,
        parameterNames = Object.keys(parameterValuesAfter),
        parameterCount = parameterNames.length,
        i, parameterName, parameterValue,
        changeCount = 0;

    // counting & storing changed parameters
    for (i = 0; i < parameterCount; i++) {
      parameterName = parameterNames[i];
      parameterValue = parameterValuesAfter[parameterName];

      if (parameterValue !== parameterValuesBefore[parameterName]) {
        this.parameterValues[parameterName] = parameterValue;
        changeCount++;
      }
    }

    if (changeCount > 0) {
      this.spawnEvent({
        eventName: $template.EVENT_TEMPLATE_PARAMETER_CHANGE,
        parameterValuesBefore: parameterValuesBefore,
        parameterValuesAfter: parameterValues
      })
      .trigger();
    }

    return this;
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.getResolvedString(this.parameterValues);
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$template.LiveTemplate} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isLiveTemplate: function (expr, message) {
    return $assert.assert(
        $template.LiveTemplate.mixedBy(expr), message);
  },

  /**
   * @param {$template.LiveTemplate} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isLiveTemplateOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $template.LiveTemplate.mixedBy(expr), message);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /** @returns {$template.LiveTemplate} */
  toLiveTemplate: function () {
    return $template.LiveTemplate.create({templateString: this.valueOf()});
  }
});

$oop.copyProperties($template, /** @lends $template */{
  /** @constant */
  EVENT_TEMPLATE_PARAMETER_CHANGE: 'template.change.parameter'
});

