"use strict";

/**
 * @function $cliUtils.Argv.create
 * @param {Object} [properties]
 * @returns {$cliUtils.Argv}
 */

/**
 * Allows logical access to command line arguments, based on argument format.
 * @class $cliUtils.Argv
 */
$cliUtils.Argv = $oop.createClass('$cliUtils.Argv')
.define(/** @lends $cliUtils.Argv# */{
  /**
   * @member {Array.<string>} $cliUtils.Argv#argumentList
   */

  /**
   * @member {$data.Collection.<string,$cliUtils.Argument>}
   *     $cliUtils.Argv#argumentCollection
   */

  /**
   * @member {$data.Collection.<string,$cliUtils.Option>} $cliUtils.Argv#options
   */

  /**
   * @memberOf $cliUtils.Argv
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
    .passEachValueTo($cliUtils.Argument.fromString, $cliUtils.Argument)
    .toCollection();

    this.options = this.options || this.argumentCollection
    .filterByValueType($cliUtils.Option)
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
