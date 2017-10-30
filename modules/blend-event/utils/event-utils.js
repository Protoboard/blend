"use strict";

$oop.copyProperties($event, /** @lends $event */{
  /**
   * Spreads specified path to its sub-paths. Result will not include
   * original path.
   * @param {string} path Path to be spread.
   * @returns {Array.<string>}
   */
  spreadPathForBubbling: function (path) {
    var components = $data.Path.fromString(path).components,
        result = [],
        i;
    for (i = components.length - 1; i > 0; i--) {
      result.push($data.Path.fromComponentsToString(components.slice(0, i)));
    }
    return result;
  },

  /**
   * Spreads specified path to relative, subscribed paths. Result will not
   * include original path.
   * @param {string} path Path to be spread.
   * @param {string} eventName Event name matching subscriptions.
   * @returns {Array.<string>}
   */
  spreadPathForBroadcast: function (path, eventName) {
    var eventSpace = $event.EventSpace.create();

    return eventSpace.subscriptions
    .getNodeWrapped(['paths', eventName].toPath())
    .asOrderedStringList()
    .getRangeByPrefixWrapped(path, 1)
    .asCollection()
    .toStringDictionary()
    .swapKeysAndValues()
    .asCollection()
    .getKeys();
  }
});
