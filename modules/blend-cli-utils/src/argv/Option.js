"use strict";

/**
 * @function $cliUtils.Option.create
 * @param {Object} [properties]
 * @returns {$cliUtils.Option}
 */

/**
 * Represents an option command line argument. Options have a name, an
 * optional value, and are passed in the format "--name=value".
 * TODO: Handle escaped special chars (=)
 * @class $cliUtils.Option
 */
$cliUtils.Option = $oop.createClass('$cliUtils.Option')
.blend($cliUtils.Argument)
.define(/** @lends $cliUtils.Option# */{
  /**
   * @member {string} $cliUtils.Option#optionName
   */

  /**
   * @member {string} $cliUtils.Option#optionValue
   */

  /** @ignore */
  spread: function () {
    var hits = $cliUtils.RE_OPTION.exec(this.argumentString) || undefined,
        optionName = hits && hits[1],
        optionValue = hits && hits[2];

    this.optionName = optionName;
    this.optionValue = (optionName !== undefined) && (optionValue === undefined) ?
        true :
        optionValue;
  }
})
.build();

$oop.copyProperties($cliUtils, /** @lends $cliUtils */{
  /**
   * Defines option structure
   */
  RE_OPTION: /--([^=]+)(?:=(.*))?/
});

$cliUtils.Argument
.forwardBlend($cliUtils.Option, function (properties) {
  return $cliUtils.RE_OPTION.test(properties.argumentString);
});