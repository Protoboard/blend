"use strict";

/**
 * @function $event.Event#create
 * @param {string} eventName
 * @returns {$event.Event}
 */

/**
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
             * @type {string}
             */
            this.eventName = eventName;

            /**
             * @type {$event.Event|Event|*}
             */
            this.originalEvent = undefined;

            /**
             * @type {*}
             */
            this.sender = undefined;

            /**
             * @type {$data.Path}
             */
            this.targetPath = undefined;

            /**
             * @type {$data.Path}
             */
            this.currentPath = undefined;

            /**
             * @type {boolean}
             */
            this.bubbles = false;

            /**
             * @type {boolean}
             */
            this.defaultPrevented = false;
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
                callbacksPath._components[3] = currentPath.toString();
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
            } while (currentPath._components.length && event.bubbles);
        },

        /** @private */
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
                    var currentPathStr = callbackPath._components[3];
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
         * @returns {$event.Event}
         */
        trigger: function () {
            if (this.sender === undefined) {
                $assert.assert(false,
                    "Event sender is not defined. Can't trigger.");
            }

            if (this.originalEvent === undefined) {
                $assert.assert(false,
                    "Original event is not defined. Can't trigger.");
            }

            if (this.targetPath === undefined) {
                $assert.assert(false,
                    "Target path is not defined. Can't trigger.");
            }

            this._invokeCallbacksOnParentPaths();

            return this;
        },

        /**
         * @todo Add event initializer callback?
         * @returns {$event.Event}
         */
        broadcast: function () {
            if (this.sender === undefined) {
                $assert.assert(false,
                    "Event sender is not defined. Can't broadcast.");
            }

            if (this.originalEvent === undefined) {
                $assert.assert(false,
                    "Original event is not defined. Can't broadcast.");
            }

            if (this.targetPath === undefined) {
                $assert.assert(false,
                    "Target path is not defined. Can't broadcast.");
            }

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
