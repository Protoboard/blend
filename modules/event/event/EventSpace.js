"use strict";

/**
 * Traversed by events. Allows subscribing and unsubscribing to/from events.
 * @todo Turn into singleton
 * @class $event.EventSpace
 * @implements $event.EventSpawner
 * @implements $event.EventTarget
 */
$event.EventSpace = $oop.getClass('$event.EventSpace')
    .implement($oop.getClass('$event.EventSpawner'))
    .implement($oop.getClass('$event.EventTarget'))
    .define(/** @lends $event.EventSpace# */{
        /** @ignore */
        init: function () {
            /**
             * @type {$data.Tree}
             */
            this.subscriptions = $data.Tree.create();

            /**
             * @type {number}
             * @private
             */
            this._lastSubscriptionId = -1;
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
         * @param {$data.Path} targetPath
         * @param {string} subscriberId
         * @private
         */
        _offSingleSubscription: function (eventName, targetPath, subscriberId) {
            var subscriptions = this.subscriptions,
                targetPathPc = targetPath && targetPath.toString();

            subscriptions
                .deletePath($data.Path.create(['callbacks', 'bySubscription',
                    eventName, targetPathPc, subscriberId]))
                .deletePath($data.Path.create(['callbacks', 'bySubscriber',
                    subscriberId, eventName, targetPathPc]))
                .deletePath($data.Path.create([
                    'paths', eventName, targetPathPc]), true);
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
                callbacksQuery = $data.Query.create(['callbacks',
                    'bySubscriber', subscriberId, eventNameQc, '*']),
                callbackPaths = subscriptions.queryPaths(callbacksQuery);

            // removing callbacks from 'bySubscriber' branch
            if (eventName !== undefined) {
                subscriptions.deletePath($data.Path.create(['callbacks',
                    'bySubscriber', subscriberId, eventName]));
            } else {
                subscriptions.deletePath($data.Path.create(['callbacks',
                    'bySubscriber', subscriberId]));
            }

            // removing callbacks from 'bySubscription' branch (one-by-one)
            callbackPaths
                .mapValues(function (/**$data.Path*/callbackPath) {
                    var components = callbackPath._components,
                        eventName = components[3],
                        targetPathStr = components[4];
                    return $data.Path.create([
                        'callbacks', 'bySubscription', eventName, targetPathStr,
                        subscriberId]);
                })
                .passEachValueTo(subscriptions.deletePath, subscriptions);

            // removing paths from target path registry
            callbackPaths
                .mapValues(function (/**$data.Path*/callbackPath) {
                    var components = callbackPath._components,
                        eventName = components[3],
                        targetPathStr = components[4];
                    return $data.Path.create(['paths', eventName,
                        targetPathStr]);
                })
                .passEachValueTo(subscriptions.deletePath, subscriptions, 0, true);
        },

        /**
         * @param {string} eventName
         * @param {$data.Path} targetPath
         * @private
         */
        _offByEventName: function (eventName, targetPath) {
            var subscriptions = this.subscriptions,
                targetPathPc = targetPath && targetPath.toString(),
                targetPathQc = targetPath ?
                    $data.escapeQueryComponent(targetPathPc) : '*',
                callbacksQuery = $data.Query.create(['callbacks',
                    'bySubscription', eventName, targetPathQc, '*']),
                callbackPaths = subscriptions.queryPaths(callbacksQuery);

            // removing callbacks from 'bySubscription' branch &
            // removing paths from 'paths' branch
            if (targetPath) {
                subscriptions
                    .deletePath($data.Path.create(['callbacks',
                        'bySubscription', eventName, targetPathPc]))
                    .deletePath($data.Path.create(['paths', eventName,
                        targetPathPc]), true);
            } else {
                subscriptions
                    .deletePath($data.Path.create(['callbacks',
                        'bySubscription', eventName]))
                    .deletePath($data.Path.create(['paths', eventName]));
            }

            // removing callbacks from 'bySubscriber' branch (one-by-one)
            callbackPaths
                .mapValues(function (/**$data.Path*/callbackPath) {
                    var components = callbackPath._components,
                        targetPathStr = components[3],
                        subscriberId = components[4];
                    return $data.Path.create([
                        'callbacks', 'bySubscriber', subscriberId, eventName,
                        targetPathStr]);
                })
                .passEachValueTo(subscriptions.deletePath, subscriptions);
        },

        /**
         * @private
         */
        _offEverything: function () {
            this.subscriptions.clear();
        },

        /**
         * @todo Implement once Event is ready
         * @param eventName
         */
        spawnEvent: function (eventName) {
        },

        /**
         * Subscribes specified callback to the event `eventName` being
         * triggered on the path `targetPath`.
         * @param {string} eventName Identifies event type
         * @param {function} callback Function to be invoked when event is
         * triggered
         * @param {$data.Path} targetPath Path on which to listen to event
         * @param {string} [subscriberId] Identifies subscriber
         * @returns {$event.EventSpace}
         */
        on: function (eventName, callback, targetPath, subscriberId) {
            subscriberId = subscriberId === undefined ?
                ++this._lastSubscriptionId :
                subscriberId;

            var subscriptions = this.subscriptions,
                targetPathStr = targetPath.toString(),

                // intended to be used for looking up callbacks when
                // triggering / broadcasting event
                callbackByTargetPath = $data.Path.create([
                    'callbacks', 'bySubscription', eventName, targetPathStr,
                    subscriberId]),

                // intended to be used for looking up callbacks for a
                // specific subscriber (and then unsubscribing, etc.)
                callbackBySubscriptionPath,

                // mostly used for looking up relative paths when broadcasting
                pathsPath;

            if (!subscriptions.hasPath(callbackByTargetPath)) {
                callbackBySubscriptionPath = $data.Path.create([
                    'callbacks', 'bySubscriber', subscriberId, eventName,
                    targetPathStr]);
                pathsPath = $data.Path.create(['paths', eventName]);

                // callback is not registered yet
                // adding callback
                subscriptions
                    .setNode(callbackByTargetPath, callback)
                    .setNode(callbackBySubscriptionPath, callback);

                // initializing ordered path list
                subscriptions
                    .getInitializedNodeWrapped(pathsPath, this._pathsInitializer)
                    .toOrderedStringList()
                    .setItem(targetPathStr);
            }

            return this;
        },

        /**
         * Unsubscribes the specified callback from the event `eventName` on
         * the path `targetPath`. Supports multiple unsubscriptions at a time.
         * - When `targetPath` is omitted, all callbacks subscribed to
         * `eventName` by `subscriberId` will be unsubscribed.
         * - When `targetPath` and `eventName` are both omitted, all
         * callbacks subscribed by `subscriberId` will be unsubscribed.
         * - When `targetPath` and `subscriberId` are both omitted, all
         * callbacks subscribing to `eventName` will be unsubscribed.
         * - When all arguments are omitted, all callbacks will be unsubscribed.
         * @param {string} [eventName] Identifies event type
         * @param {function} [callback] Function to be invoked when event is
         * triggered. *Has no effect*
         * @param {$data.Path} [targetPath] Path on which to listen to event
         * @param {string} [subscriberId] Identifies subscriber
         * @returns {$event.EventSpace}
         */
        off: function (eventName, callback, targetPath, subscriberId) {
            switch (true) {
            case eventName !== undefined && targetPath && subscriberId !== undefined:
                // everything provided, straight up unsubscription of a
                // single callback
                this._offSingleSubscription(eventName, targetPath, subscriberId);
                break;

            case subscriberId !== undefined:
                // only subscriber is identified, eventName and targetPath
                // might not be
                this._offBySubscriber(subscriberId, eventName);
                break;

            case eventName !== undefined:
                // no subscriber but callback present
                // finding single callback by querying subscriptions
                this._offByEventName(eventName, targetPath);
                break;

            default:
                // unsubscribing from everything
                this._offEverything();
                break;
            }

            return this;
        }
    });
