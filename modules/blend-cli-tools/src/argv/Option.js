"use strict";

/**
 * @function $cliTools.Option.create
 * @param {Object} [properties]
 * @returns {$cliTools.Option}
 */

/**
 * TODO: Handle escaped special chars (=)
 * @class $cliTools.Option
 */
$cliTools.Option = $oop.createClass('$cliTools.Option')
.blend($cliTools.Argument)
.define(/** @lends $cliTools.Option# */{
  /**
   * @member {string} $cliTools.Option#optionName
   */

  /**
   * @member {string} $cliTools.Option#optionValue
   */

  /** @ignore */
  spread: function () {
    var hits = $cliTools.RE_OPTION.exec(this.argumentString) || undefined,
        optionName = hits && hits[1],
        optionValue = hits && hits[2];

    this.optionName = optionName;
    this.optionValue = (optionName !== undefined) && (optionValue === undefined) ?
        true :
        optionValue;
  }
})
.build();

$oop.copyProperties($cliTools, /** @lends $cliTools */{
  /**
   * Defines option structure
   */
  RE_OPTION: /--([^=]+)(?:=(.*))?/
});

$cliTools.Argument
.forwardBlend($cliTools.Option, function (properties) {
  return $cliTools.RE_OPTION.test(properties.argumentString);
});