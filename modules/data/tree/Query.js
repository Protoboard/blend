"use strict";

/**
 * @function $data.Query.create
 * @param {string[]} components
 * @returns {$data.Query}
 */

/**
 * @class $data.Query
 * @mixes $utils.Cloneable
 * @implements $utils.Stringifiable
 * @implements $data.Matchable
 */
$data.Query = $oop.getClass('$data.Query')
    .extend($utils.Cloneable)
    .implement($utils.Stringifiable)
    .implement($oop.getClass('$data.Matchable'))
    .define(/** @lends $data.Query# */{
        /**
         * @param {QueryComponent[]|string[]} components
         * @ignore
         */
        init: function (components) {
            $assert.isArray(components, "Invalid component list");

            var QueryComponent = $data.QueryComponent;

            /**
             * Query components.
             * @type {QueryComponent[]}
             * @private
             */
            this._components = components
                .map(function (component) {
                    return QueryComponent.isIncludedBy(component) ?
                        component :
                        QueryComponent.create(component);
                });
        },

        /**
         * Returns string representation of path.
         * @returns {string}
         */
        toString: function () {
            return this._components
                .map(String)
                .map($data.escapePathComponent)
                .join($data.PATH_COMPONENT_SEPARATOR);
        },

        /**
         * @param {$data.Path} path
         * @returns {boolean}
         */
        matches: function (path) {
            var queryComponents = this._components,
                queryComponentCount = queryComponents.length,
                pathComponents = path._components,
                pathComponentCount = pathComponents.length,
                i, currentQueryComponent, nextQueryComponent,
                j, currentPathComponent;

            for (i = 0, j = 0; i < queryComponentCount; i++, j++) {
                currentQueryComponent = queryComponents[i];
                if (currentQueryComponent._isSkipper) {
                    // current query component skips
                    nextQueryComponent = queryComponents[i + 1];

                    // seeking forward in path as long as path component
                    // matches query component, but next query component
                    // does not
                    for (; j < pathComponentCount; j++) {
                        currentPathComponent = pathComponents[j];
                        if (!currentQueryComponent.matches(currentPathComponent)) {
                            // query component does not match path component
                            return false;
                        } else if (nextQueryComponent &&
                            nextQueryComponent.matches(currentPathComponent)
                        ) {
                            // next query component matches current path
                            // component
                            // keeping focus on current path component while
                            // letting query component advance to next
                            j--;
                            break;
                        }
                    }

                    if (i === queryComponentCount - 1 &&
                        j === pathComponentCount
                    ) {
                        // reached end of both query and path
                        return true;
                    }
                } else {
                    currentPathComponent = pathComponents[j];
                    if (!currentQueryComponent.matches(currentPathComponent)) {
                        // component mismatch
                        return false;
                    }
                }
            }

            // reached end of query
            // if we also reached the end of the path, it's a match
            return j === pathComponentCount;
        }
    });

$oop.copyProperties($assert, /** @lends $assert# */{
    /**
     * @param {$data.Query} expr
     * @param {string} [message]
     * @returns {$assert}
     */
    isQuery: function (expr, message) {
        return $assert.assert(
            $data.Query.isIncludedBy(expr), message);
    },

    /**
     * @param {$data.Query} [expr]
     * @param {string} [message]
     * @returns {$assert}
     */
    isQueryOptional: function (expr, message) {
        return $assert.assert(
            expr === undefined ||
            $data.Query.isIncludedBy(expr), message);
    }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
    /**
     * @returns {$data.Query}
     */
    toQuery: function () {
        var components = $utils.safeSplit(this, $data.PATH_COMPONENT_SEPARATOR);
        return $data.Query.create(components);
    }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
    /**
     * @returns {$data.Query}
     */
    toQuery: function () {
        return $data.Query.create(this);
    }
});
