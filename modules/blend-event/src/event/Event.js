"use strict";

/**
 * @function $event.Event.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @returns {$event.Event}
 */

/**
 * Signals a change in the state of some component of the application. Carries
 * information about the affected component and the cause(s) that led to the
 * corresponding change.
 * @class $event.Event
 * @extends $utils.Cloneable
 * @extends $data.Link
 * @todo Add getter functions for causingEvents
 */
$event.Event = $oop.createClass('$event.Event')
.blend($utils.Cloneable)
.blend($data.Link)
.define(/** @lends $event.Event# */{
  /**
   * Identifies event type.
   * @member {string} $event.Event#eventName
   */

  /**
   * Identifies the application component (instance) that is responsible for
   * triggering the current event.
   * @member {*} $event.Event#sender
   */

  /**
   * Event instance the current event is the effect of. In other words, the
   * triggering of which led to the triggering of the current event. A chain
   * of causing events usually leads back to user interaction, or scheduled
   * operations.
   * @member {$event.Event} $event.Event#causingEvent
   */

  /**
   * List of paths the event will trigger when triggered.
   * @member {Array.<string>} $event.Event#targetPaths
   */

  /**
   * Path currently visited by the event. Defined only while triggered.
   * @member {string} $event.Event#currentPath
   */

  /**
   * Whether the event propagates.
   * @member {boolean} $event.Event#propagates
   */

  /**
   * Creates a `Event` instance based on the specified event name.
   * @memberOf $event.Event
   * @param {string} eventName
   * @param {Object} [properties]
   * @returns {$event.Event}
   */
  fromEventName: function (eventName, properties) {
    return this.create({eventName: eventName}, properties);
  },

  /** @ignore */
  defaults: function () {
    if (this.propagates === undefined) {
      this.propagates = true;
    }
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.eventName, "Invalid eventName.");

    this.targetPaths = this.targetPaths || [];

    this.elevateMethods('unlink');
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
   * @param {Array.<string>} targetPaths
   * @returns {$event.Event}
   */
  addTargetPaths: function (targetPaths) {
    this.targetPaths = this.targetPaths.concat(targetPaths);
    return this;
  },

  /**
   * @param {string} targetPath
   * @returns {$event.Event}
   */
  addTargetPath: function (targetPath) {
    this.targetPaths.push(targetPath);
    return this;
  },

  /**
   * @param {string} targetPath
   * @returns {$event.Event}
   */
  addBubblingPath: function (targetPath) {
    this.addTargetPaths($event.spreadPathForBubbling(targetPath));
    return this;
  },

  /**
   * @param {string} targetPath
   * @returns {$event.Event}
   */
  addBroadcastPath: function (targetPath) {
    this.addTargetPaths($event.spreadPathForBroadcast(targetPath, this.eventName));
    return this;
  },

  /**
   * @param {boolean} propagates
   * @returns {$event.Event}
   */
  setPropagates: function (propagates) {
    this.propagates = propagates;
    return this;
  },

  /**
   * @returns {$event.Event}
   */
  stopPropagation: function () {
    this.propagates = false;
    return this;
  },

  /**
   * Retrieves a list of events that led to the triggering of the current
   * event, in causal order.
   * @returns {Array.<$event.Event|*>}
   */
  getCausingEvents: function () {
    var causingEvent = this.causingEvent,
        result = [];
    while (causingEvent) {
      result.unshift(causingEvent);
      causingEvent = causingEvent.causingEvent;
    }
    return result;
  },

  /**
   * Retrieves the last event on the chain of causing events that match the
   * specified `eventName`.
   * @param {string} eventName
   * @returns {$event.Event|*}
   */
  getLastCausingEventByName: function (eventName) {
    var causingEvent = this.causingEvent;
    while (causingEvent && causingEvent.eventName !== eventName) {
      causingEvent = causingEvent.causingEvent;
    }
    return causingEvent;
  },

  /**
   * @param {$oop.Class} Class
   * @returns {$event.Event|*}
   */
  getLastCausingEventByClass: function (Class) {
    var causingEvent = this.causingEvent;
    while (causingEvent && !Class.mixedBy(causingEvent)) {
      causingEvent = causingEvent.causingEvent;
    }
    return causingEvent;
  },

  /**
   * Invokes callbacks subscribed to `eventName`, on each of
   * `targetPaths`. Callbacks on a certain path will be invoked in an
   * unspecified order. The returned promise resolves when all subscribed
   * callbacks (synchronous or otherwise) have completed.
   * @returns {$utils.Promise}
   * @see $event.EventSpace#on
   */
  trigger: function () {
    var eventTrail = $event.EventTrail.create(),
        eventSpace = $event.EventSpace.create(),
        eventName = this.eventName,
        targetPaths = this.targetPaths,
        targetPathCount = targetPaths.length,
        i, targetPath,
        callbacksPath,
        callbacks,
        subscriberIds,
        callbackCount,
        j,
        results = [];

    this.causingEvent = eventTrail.isEmpty() ?
        undefined :
        eventTrail.data.previousLink;

    eventTrail.push(this);

    traversal:
        for (i = 0; i < targetPathCount; i++) {
          targetPath = targetPaths[i];
          callbacksPath = $data.TreePath.fromComponents([
            'callbacks', 'bySubscription', eventName, targetPath]);
          callbacks = eventSpace.subscriptions.getNode(callbacksPath);
          subscriberIds = callbacks && Object.keys(callbacks);
          callbackCount = subscriberIds && subscriberIds.length || 0;

          // setting current path
          this.currentPath = targetPath;

          // invoking callbacks for eventName / targetPath
          for (j = 0; j < callbackCount; j++) {
            results.push(callbacks[subscriberIds[j]](this));
            if (!this.propagates) {
              // todo Test stopping propagation
              break traversal;
            }
          }
        }

    return this._unlinkWhen(results);
  }
})
.build();
