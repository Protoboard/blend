"use strict";

/**
 * @function $event.Event#create
 * @param {string} eventName
 * @returns {$event.Event}
 */

/**
 * Signals a change in the state of some component of the application.
 * Carries information about the affected component and the cause(s) that
 * led to the corresponding change.
 * @todo Extend $data.Link
 * @todo What about payload?
 * @class $event.Event
 * @extends $utils.Cloneable
 * @implements $event.EventSource
 */
$event.Event = $oop.getClass('$event.Event')
  .include($utils.Cloneable)
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
       * current event. A chain of `originalEvents` usually leads back to
       * user interaction, or scheduled operations.
       * @member {$event.Event|Event|*} $event.Event#originalEvent
       */
      this.originalEvent = undefined;

      /**
       * Identifies the application component (instance) that is
       * responsible for triggering the current event.
       * @member {*} $event.Event#sender
       */
      this.sender = undefined;

      /**
       * Original path the event was triggered on. When event was broadcast,
       * it's the broadcast path. When the event has not been triggered (or
       * broadcast) yet, `targetPath` is `undefined`.
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
    },

    /** @private */
    _invokeCallbacksOnParentPaths: function () {
      var eventSpace = $event.EventSpace.create(),
        event = this.clone(),
        subscriptions = eventSpace.subscriptions,
        eventName = event.eventName,
        targetPath = event.targetPath,
        currentPath = event.currentPath = targetPath.clone(),
        callbacksPath = $data.Path.create(['callbacks',
          'bySubscription', eventName, null]),
        callbacks, subscriberIds, callbackCount,
        i;

      do {
        // obtaining callbacks associated with eventName / targetPath
        callbacksPath.components[3] = currentPath.toString();
        callbacks = subscriptions.getNode(callbacksPath);
        if (callbacks) {
          // invoking callbacks for eventName / targetPath
          subscriberIds = Object.keys(callbacks);
          callbackCount = subscriberIds.length;
          for (i = 0; i < callbackCount; i++) {
            // todo Add event unlinking
            callbacks[subscriberIds[i]](event);
          }
        }

        // bubbling one level up
        currentPath.pop();
      } while (currentPath.components.length && event.bubbles);
    },

    /**
     * @todo Add event initializer callback?
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
          'callbacks', 'bySubscription', eventName, pathsQc, '*']);

      // obtaining affected paths
      subscriptions.getNodeWrapped(['paths', eventName].toPath())
        .toOrderedStringList()
        .getRangeByPrefixWrapped(targetPath.toString(), 1)
        .passDataTo(pathsQc.setKeyOptions, pathsQc);

      // invoking callbacks
      subscriptions.queryPathNodePairs(callbacksQuery)
        .forEachItem(function (/**function*/callback, /**$data.Path*/callbackPath) {
          // preparing event
          // todo Defer preparation to host / subclass
          var currentPathStr = callbackPath.components[3];
          event.currentPath = $data.Path.fromString(currentPathStr);
          callback(event);
        });
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
     * `targetPath` up to its root, and invoke subscribed callbacks at each
     * step. Callbacks on a certain path will be invoked in an unspecified
     * order.
     * @returns {$event.Event}
     * @see $event.EventSpace#on
     */
    trigger: function () {
      $assert
        .isDefined(this.sender, "Event sender is not defined. Can't trigger.")
        .isDefined(this.originalEvent,
          "Original event is not defined. Can't trigger.");

      this._invokeCallbacksOnParentPaths();

      return this;
    },

    /**
     * Broadcasts event. Invokes callbacks subscribed to `eventName`, on all
     * paths relative to `targetPath`, in an unspecified order, then
     * continues as {@link $event.Event#trigger}.
     * @returns {$event.Event}
     */
    broadcast: function () {
      $assert
        .isDefined(this.sender, "Event sender is not defined. Can't trigger.")
        .isDefined(this.originalEvent,
          "Original event is not defined. Can't trigger.");

      this._invokeCallbacksOnDescendantPaths();
      this._invokeCallbacksOnParentPaths();

      return this;
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
