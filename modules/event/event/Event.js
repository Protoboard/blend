"use strict";

/**
 * @function $event.Event#create
 * @param {string} eventName
 * @returns {$event.Event}
 */

/**
 * Signals a change in the state of some component of the application. Carries
 * information about the affected component and the cause(s) that led to the
 * corresponding change.
 * @todo What about payload?
 * @class $event.Event
 * @extends $data.Link
 * @extends $utils.Cloneable
 * @implements $event.EventSource
 */
$event.Event = $oop.getClass('$event.Event')
.extend($data.Link)
.extend($utils.Cloneable)
.implement($oop.getClass('$event.EventSource'))
.define(/** @lends $event.Event# */{
  /**
   * @param {string} eventName
   * @ignore
   */
  init: function (eventName) {
    /**
     * Identifies event type.
     * @member {string} $event.Event#eventName
     */
    this.eventName = eventName;

    /**
     * Event instance the triggering of which led to the triggering of the
     * current event. A chain of `originalEvents` usually leads back to user
     * interaction, or scheduled operations.
     * @member {$event.Event|Event|*} $event.Event#originalEvent
     */
    this.originalEvent = undefined;

    /**
     * Identifies the application component (instance) that is responsible for
     * triggering the current event.
     * @member {*} $event.Event#sender
     */
    this.sender = undefined;

    /**
     * Original path the event was triggered on. When event was broadcast, it's
     * the broadcast path. When the event has not been triggered (or broadcast)
     * yet, `targetPath` is `undefined`.
     * @member {$data.Path} $event.Event#targetPath
     */
    this.targetPath = undefined;

    /**
     * Path currently visited by the event in the process of bubbling or
     * broadcasting.
     * @member {$data.Path} $event.Event#currentPath
     */
    this.currentPath = undefined;

    /**
     * Whether event bubbles along parent chain.
     * @member {boolean} $event.Event#bubbles
     * @default false
     * @todo Special case for 1-level bubbling?
     */
    this.bubbles = false;

    /**
     * Whether default behavior associated with event (if any) is going to be
     * triggered.
     * @member {boolean} $event.Event#defaultPrevented
     * @default true
     */
    this.defaultPrevented = true;

    this.elevateMethods('unlink');
  },

  /**
   * @returns {Array<$utils.Thenable|*>}
   * @private
   */
  _invokeCallbacksOnTargetPath: function () {
    var eventSpace = $event.EventSpace.create(),
        eventName = this.eventName,
        targetPath = this.targetPath,
        callbacksPath = $data.Path.create([
          'callbacks', 'bySubscription', eventName, targetPath.toString()]),
        callbacks = eventSpace.subscriptions.getNode(callbacksPath),
        subscriberIds = callbacks && Object.keys(callbacks),
        callbackCount = subscriberIds && subscriberIds.length || 0,
        i,
        results = [];

    // setting current path
    this.currentPath = targetPath;

    // invoking callbacks for eventName / targetPath
    for (i = 0; i < callbackCount; i++) {
      results.push(callbacks[subscriberIds[i]](this));
    }

    return results;
  },

  /**
   * @returns {Array<$utils.Thenable|*>}
   * @private
   */
  _invokeCallbacksOnParentPaths: function () {
    var eventSpace = $event.EventSpace.create(),
        event = this.clone(),
        subscriptions = eventSpace.subscriptions,
        eventName = event.eventName,
        targetPath = event.targetPath,
        currentPath = event.currentPath = targetPath.clone(),
        callbacksPath = $data.Path.create([
          'callbacks', 'bySubscription', eventName, null]),
        callbacks, subscriberIds, callbackCount,
        i,
        results = [];

    do {
      // obtaining callbacks associated with eventName / targetPath
      callbacksPath.components[3] = currentPath.toString();
      callbacks = subscriptions.getNode(callbacksPath);
      if (callbacks) {
        // invoking callbacks for eventName / targetPath
        subscriberIds = Object.keys(callbacks);
        callbackCount = subscriberIds.length;
        for (i = 0; i < callbackCount; i++) {
          results.push(callbacks[subscriberIds[i]](event));
        }
      }

      // bubbling one level up
      currentPath.pop();
    } while (currentPath.components.length && event.bubbles);

    return results;
  },

  /**
   * @returns {Array<$utils.Thenable|*>}
   * @private
   */
  _invokeCallbacksOnDescendantPaths: function () {
    var eventSpace = $event.EventSpace.create(),
        event = this.clone()
        .setBubbles(false),
        subscriptions = eventSpace.subscriptions,
        eventName = event.eventName,
        targetPath = event.targetPath,
        pathsQc = $data.QueryComponent.create(),
        callbacksQuery = $data.Query.create([
          'callbacks', 'bySubscription', eventName, pathsQc, '*']),
        results = [];

    // obtaining affected paths
    subscriptions.getNodeWrapped(['paths', eventName].toPath())
    .toOrderedStringList()
    .getRangeByPrefixWrapped(targetPath.toString(), 1)
    .passDataTo(pathsQc.setKeyOptions, pathsQc);

    // invoking callbacks
    subscriptions.queryPathNodePairs(callbacksQuery)
    .forEachItem(function (/**function*/callback, /**$data.Path*/callbackPath) {
      var currentPathStr = callbackPath.components[3];
      event.currentPath = $data.Path.fromString(currentPathStr);
      results.push(callback(event));
    });

    return results;
  },

  /**
   * @param {Array<$utils.Thenable>} thenables
   * @returns {$utils.Promise}
   * @private
   */
  _unlinkWhen: function (thenables) {
    return $utils.Promise.when(thenables)
    .then(this.unlink, this.unlink);
  },

  /**
   * @returns {$event.Event}
   */
  clone: function clone() {
    var cloned = clone.returned;

    cloned.originalEvent = this.originalEvent;
    cloned.sender = this.sender;
    cloned.targetPath = this.targetPath;
    cloned.currentPath = this.currentPath;
    cloned.bubbles = this.bubbles;
    cloned.defaultPrevented = this.defaultPrevented;

    return cloned;
  },

  /**
   * Triggers event. Invokes callbacks subscribed to `eventName`, on
   * `targetPath`. When bubbling is allowed, the event will traverse
   * `targetPath` up to its root, and invoke subscribed callbacks at each step.
   * Callbacks on a certain path will be invoked in an unspecified order. The
   * returned promise resolves when all subscribed callbacks (synchronous or
   * otherwise) have completed.
   * @returns {$utils.Promise}
   * @see $event.EventSpace#on
   */
  trigger: function () {
    if (this.sender === undefined) {
      $assert.assert(false, "Event sender is not defined. Can't trigger.");
    }

    var originalEventChain = $event.OriginalEventChain.create();

    if (this.originalEvent === undefined && !originalEventChain.isEmpty()) {
      this.originalEvent = originalEventChain.data.previousLink;
    }

    originalEventChain.push(this);

    var callbackResults = this.bubbles ?
        this._invokeCallbacksOnParentPaths() :
        this._invokeCallbacksOnTargetPath();

    return this._unlinkWhen(callbackResults);
  },

  /**
   * Broadcasts event. Invokes callbacks subscribed to `eventName`, on all
   * paths relative to `targetPath`, in an unspecified order, then continues as
   * {@link $event.Event#trigger}. The returned promise resolves when all
   * subscribed callbacks (synchronous or otherwise) have completed.
   * @returns {$utils.Promise}
   * @see $event.EventSpace#on
   */
  broadcast: function () {
    if (this.sender === undefined) {
      $assert.assert(false, "Event sender is not defined. Can't broadcast.");
    }

    var originalEventChain = $event.OriginalEventChain.create();

    if (this.originalEvent === undefined && !originalEventChain.isEmpty()) {
      this.originalEvent = originalEventChain.data.previousLink;
    }

    originalEventChain.push(this);

    var callbackResults1 = this._invokeCallbacksOnDescendantPaths(),
        callbackResults2 = this.bubbles ?
            this._invokeCallbacksOnParentPaths() :
            this._invokeCallbacksOnTargetPath();

    return this._unlinkWhen(callbackResults1.concat(callbackResults2));
  },

  /**
   * @param originalEvent
   * @returns {$event.Event}
   */
  setOriginalEvent: function (originalEvent) {
    this.originalEvent = originalEvent;
    return this;
  },

  /**
   * @param sender
   * @returns {$event.Event}
   */
  setSender: function (sender) {
    this.sender = sender;
    return this;
  },

  /**
   * @param targetPath
   * @returns {$event.Event}
   */
  setTargetPath: function (targetPath) {
    this.targetPath = targetPath;
    return this;
  },

  /**
   * @param bubbles
   * @returns {$event.Event}
   */
  setBubbles: function (bubbles) {
    this.bubbles = bubbles;
    return this;
  },

  /**
   * @returns {$event.Event}
   */
  stopPropagation: function () {
    this.bubbles = false;
    return this;
  },

  /**
   * @returns {$event.Event}
   */
  preventDefault: function () {
    this.defaultPrevented = true;
    return this;
  }
});
