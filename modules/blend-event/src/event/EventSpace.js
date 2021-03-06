"use strict";

/**
 * The event mechanism instantiates `EventSpace`. Do not instantiate it
 * directly.
 * @function $event.EventSpace.create
 * @returns {$event.EventSpace}
 */

/**
 * Traversed by events. Allows subscribing and unsubscribing to/from events.
 * @class $event.EventSpace
 * @extends $utils.Destructible
 */
$event.EventSpace = $oop.createClass('$event.EventSpace')
.blend($oop.Singleton)
.blend($utils.Destructible)
.define(/** @lends $event.EventSpace# */{
  /**
   * @member {$data.Tree} $event.EventSpace#subscription
   */

  /** @ignore */
  init: function () {
    this.subscriptions = $data.Tree.create();
  },

  /**
   * @returns {Array}
   * @private
   */
  _pathsInitializer: function () {
    return [];
  },

  /**
   * @param {string} eventName
   * @param {string} targetPath
   * @param {string} subscriberId
   * @private
   */
  _offSingleSubscription: function (eventName, targetPath, subscriberId) {
    var subscriptions = this.subscriptions;

    // `deleteNode` does not clean up the registry nicely, but is
    // functionally sufficient and also much faster than `deletePath`
    subscriptions
    .deleteNode($data.TreePath.fromComponents([
      'callbacks', 'bySubscription', eventName, targetPath, subscriberId]))
    .deleteNode($data.TreePath.fromComponents([
      'callbacks', 'bySubscriber', subscriberId, eventName, targetPath]));

    subscriptions
    .getNodeWrapped($data.TreePath.fromComponents(['paths', eventName]))
    .asOrderedStringList()
    .deleteItem(targetPath);
  },

  /**
   * @param {string} subscriberId
   * @param {string} [eventName]
   * @private
   */
  _offBySubscriber: function (subscriberId, eventName) {
    var subscriptions = this.subscriptions,
        eventNameQc = eventName !== undefined ?
            $data.escapeQueryComponent(eventName) : '*',
        callbacksQuery = $data.TreeQuery.fromComponents([
          'callbacks', 'bySubscriber', subscriberId, eventNameQc, '*']),
        callbackPaths = subscriptions.queryPathsWrapped(callbacksQuery);

    // removing callbacks from 'bySubscriber' branch
    if (eventName !== undefined) {
      subscriptions.deletePath($data.TreePath.fromComponents([
        'callbacks', 'bySubscriber', subscriberId, eventName]));
    } else {
      subscriptions.deleteNode($data.TreePath.fromComponents([
        'callbacks', 'bySubscriber', subscriberId]));
    }

    // removing callbacks from 'bySubscription' branch (one-by-one)
    callbackPaths
    .mapValues(function (/**$data.TreePath*/callbackPath) {
      var components = callbackPath.components,
          eventName = components[3],
          targetPath = components[4];
      return $data.TreePath.fromComponents([
        'callbacks', 'bySubscription', eventName, targetPath, subscriberId]);
    })
    .passEachValueTo(subscriptions.deletePath, subscriptions);

    // removing paths from target path registry
    callbackPaths
    .forEachItem(function (/**$data.TreePath*/callbackPath) {
      var components = callbackPath.components,
          eventName = components[3],
          targetPath = components[4];

      subscriptions.getNodeWrapped(
          $data.TreePath.fromComponents(['paths', eventName]))
      .asOrderedStringList()
      .deleteItem(targetPath);
    });
  },

  /**
   * @param {string} eventName
   * @param {string} targetPath
   * @private
   */
  _offByEventName: function (eventName, targetPath) {
    var subscriptions = this.subscriptions,
        targetPathQc = targetPath ?
            $data.escapeQueryComponent(targetPath) : '*',
        callbacksQuery = $data.TreeQuery.fromComponents([
          'callbacks', 'bySubscription', eventName, targetPathQc, '*']),
        callbackPaths = subscriptions.queryPathsWrapped(callbacksQuery);

    // removing callbacks from 'bySubscription' branch &
    // removing paths from 'paths' branch
    if (targetPath) {
      subscriptions
      .deleteNode($data.TreePath.fromComponents([
        'callbacks', 'bySubscription', eventName, targetPath]));

      subscriptions
      .getNodeWrapped($data.TreePath.fromComponents(['paths', eventName]))
      .asOrderedStringList()
      .deleteItem(targetPath);
    } else {
      subscriptions
      .deleteNode($data.TreePath.fromComponents([
        'callbacks', 'bySubscription', eventName]))
      .deleteNode($data.TreePath.fromComponents(['paths', eventName]));
    }

    // removing callbacks from 'bySubscriber' branch (one-by-one)
    callbackPaths
    .mapValues(function (/**$data.TreePath*/callbackPath) {
      var components = callbackPath.components,
          targetPath = components[3],
          subscriberId = components[4];
      return $data.TreePath.fromComponents([
        'callbacks', 'bySubscriber', subscriberId, eventName, targetPath]);
    })
    .passEachValueTo(subscriptions.deleteNode, subscriptions);
  },

  /**
   * @inheritDoc
   */
  destroy: function () {
    this.subscriptions.destroy();
  },

  /**
   * Subscribes specified callback to the event `eventName` being triggered on
   * the path `targetPath`.
   * @param {string} eventName Identifies event type
   * @param {string} targetPath Path on which to listen to event
   * @param {string} subscriberId Identifies subscriber
   * @param {function} callback Function to be invoked when event is triggered
   * @returns {$event.EventSpace}
   */
  on: function (eventName, targetPath, subscriberId, callback) {
    var subscriptions = this.subscriptions,

        // intended to be used for looking up callbacks when triggering /
        // broadcasting event
        callbackByTargetPath = $data.TreePath.fromComponents([
          'callbacks', 'bySubscription', eventName, targetPath,
          subscriberId]),

        // intended to be used for looking up callbacks for a specific
        // subscriber (and then unsubscribing, etc.)
        callbackBySubscriptionPath,

        // mostly used for looking up relative paths when broadcasting
        pathsPath;

    if (!subscriptions.hasPath(callbackByTargetPath)) {
      callbackBySubscriptionPath = $data.TreePath.fromComponents([
        'callbacks', 'bySubscriber', subscriberId, eventName, targetPath]);
      pathsPath = $data.TreePath.fromComponents(['paths', eventName]);

      // callback is not registered yet
      // adding callback
      subscriptions
      .setNode(callbackByTargetPath, callback)
      .setNode(callbackBySubscriptionPath, callback);

      // initializing ordered path list
      subscriptions
      .getInitializedNodeWrapped(pathsPath, this._pathsInitializer)
      .asOrderedStringList()
      .setItem(targetPath);
    }

    return this;
  },

  /**
   * Unsubscribes the specified subscriber from the event `eventName` on the
   * path `targetPath`. Supports multiple unsubscriptions at a time.
   * - When `targetPath` is omitted, all callbacks subscribed to `eventName` by
   * `subscriberId` will be unsubscribed.
   * - When `targetPath` and `eventName` are both omitted, all callbacks
   * subscribed by `subscriberId` will be unsubscribed.
   * - When `targetPath` and `subscriberId` are both omitted, all callbacks
   * subscribing to `eventName` will be unsubscribed.
   * - When all arguments are omitted, all callbacks will be unsubscribed.
   * @param {string} [eventName] Identifies event type
   * @param {$data.TreePath} [targetPath] Path on which to listen to event
   * @param {string} [subscriberId] Identifies subscriber
   * @returns {$event.EventSpace}
   */
  off: function (eventName, targetPath, subscriberId) {
    switch (true) {
    case eventName !== undefined && targetPath && subscriberId !== undefined:
      // everything provided, straight up unsubscription of a single callback
      this._offSingleSubscription(eventName, targetPath, subscriberId);
      break;

    case subscriberId !== undefined:
      // only subscriber is identified, eventName and targetPath might not be
      this._offBySubscriber(subscriberId, eventName);
      break;

    case eventName !== undefined:
      // no subscriber but callback present
      // finding single callback by querying subscriptions
      this._offByEventName(eventName, targetPath);
      break;

    default:
      $assert.fail("Invalid event unsubscription parameters");
      /* istanbul ignore next */
      break;
    }

    return this;
  }
})
.build();
