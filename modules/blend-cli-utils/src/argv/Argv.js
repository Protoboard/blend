"use strict";

/**
 * @function $cli.Argv.create
 * @param {Object} [properties]
 * @returns {$cli.Argv}
 */

/**
 * Allows logical access to command line arguments, based on argument format.
 * @class $cli.Argv
 */
$cli.Argv = $oop.createClass('$cli.Argv')
.define(/** @lends $cli.Argv# */{
  /**
   * @member {Array.<string>} $cli.Argv#argumentList
   */

  /**
   * @member {$data.Collection.<string,$cli.Argument>}
   *     $cli.Argv#argumentCollection
   */

  /**
   * @member {$data.Collection.<string,$cli.Option>} $cli.Argv#options
   */

  /**
   * @memberOf $cli.Argv
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
  },

  /** @ignore */
  init: function () {
    this.argumentCollection = this.argumentCollection || $data.Collection.fromData(this.argumentList)
    .mapKeys(function (argument) {
      return argument;
    })
    .passEachValueTo($cli.Argument.fromString, $cli.Argument)
    .toCollection();

    this.options = this.options || this.argumentCollection
    .filterByValueType($cli.Option)
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
