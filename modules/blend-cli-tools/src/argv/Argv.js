"use strict";

/**
 * @function $cliTools.Argv.create
 * @param {Object} [properties]
 * @returns {$cliTools.Argv}
 */

/**
 * Allows logical access to command line arguments, based on argument format.
 * @class $cliTools.Argv
 */
$cliTools.Argv = $oop.createClass('$cliTools.Argv')
.define(/** @lends $cliTools.Argv# */{
  /**
   * @member {Array.<string>} $cliTools.Argv#argumentList
   */

  /**
   * @member {$data.Collection.<string,$cliTools.Argument>}
   *     $cliTools.Argv#argumentCollection
   */

  /**
   * @member {$data.Collection.<string,$cliTools.Option>} $cliTools.Argv#options
   */

  /**
   * @memberOf $cliTools.Argv
   * @param {Array.<string>} argv
   */
  fromArray: function (argv) {
    return this.create({
      argumentList: argv
    });
  },

  /** @ignore */
  defaults: function () {
    this.argumentList = this.argumentList || [];

    this.argumentCollection = this.argumentCollection || $data.Collection.fromData(this.argumentList)
    .mapKeys(function (argument) {
      return argument;
    })
    .passEachValueTo($cliTools.Argument.fromString, $cliTools.Argument)
    .toCollection();

    this.options = this.options || this.argumentCollection
    .filterByValueType($cliTools.Option)
    .mapKeys(function (option) {
      return option.optionName;
    })
    .toCollection();
  },

  /**
   * Retrieves value of specified option.
   * @param {string} optionName
   * @returns {string}
   */
  getOptionValue: function (optionName) {
    var option = this.options.getValue(optionName);
    return option && option.optionValue;
  },

  /**
   * Determines whether the specified option exists.
   * @param {string} optionName
   * @returns {boolean}
   */
  hasOption: function (optionName) {
    return !!this.options.getValue(optionName);
  }
})
.build();
