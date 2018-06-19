"use strict";

/**
 * @function $cli.Option.create
 * @param {Object} [properties]
 * @returns {$cli.Option}
 */

/**
 * Represents an option command line argument. Options have a name, an
 * optional value, and are passed in the format "--name=value".
 * TODO: Handle escaped special chars (=)
 * @class $cli.Option
 */
$cli.Option = $oop.createClass('$cli.Option')
.blend($cli.Argument)
.define(/** @lends $cli.Option# */{
  /**
   * @member {string} $cli.Option#optionName
   */

  /**
   * @member {string} $cli.Option#optionValue
   */

  /** @ignore */
  spread: function () {
    var hits = $cli.RE_OPTION.exec(this.argumentString) || undefined,
        optionName = hits && hits[1],
        optionValue = hits && hits[2];

    this.optionName = optionName;
    this.optionValue = (optionName !== undefined) && (optionValue === undefined) ?
        true :
        optionValue;
  }
})
.build();

$oop.copyProperties($cli, /** @lends $cli */{
  /**
   * Defines option structure
   */
  RE_OPTION: /--([^=]+)(?:=(.*))?/
});

$cli.Argument
.forwardBlend($cli.Option, function (properties) {
  return $cli.RE_OPTION.test(properties.argumentString);
});