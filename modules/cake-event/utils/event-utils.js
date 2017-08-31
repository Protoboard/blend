"use strict";

$oop.copyProperties($event, /** @lends $event */{
  /**
   * Spreads specified path to its sub-paths.
   * @param {$data.Path} path Path to be spread.
   * @returns {Array.<$data.Path>}
   */
  spreadPathForBubbling: function (path) {
    var components = path.components,
        result = [path],
        i;
    for (i = components.length - 1; i > 0; i--) {
      result.push($data.Path.fromComponents(components.slice(0, i)));
    }
    return result;
  },

  /**
   * Spreads specified path to relative, subscribed paths.
   * @param {$data.Path} path Path to be spread.
   * @param {string} eventName Event name matching subscriptions.
   * @returns {Array.<string>}
   */
  spreadPathForBroadcast: function (path, eventName) {
    var eventSpace = $event.EventSpace.create(),
        pathStr = path.toString();

    return eventSpace.subscriptions
    .getNodeWrapped(['paths', eventName].toPath())
    .toOrderedStringList()
    .getRangeByPrefixWrapped(pathStr)
    .toCollection()
    .passEachValueTo($data.Path.fromString)
        .data;
  }
});
