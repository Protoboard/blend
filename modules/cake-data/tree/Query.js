"use strict";

/**
 * @function $data.Query.create
 * @param {Object} properties
 * @param {string[]} properties.components Series of patterns to match
 * corresponding path components.
 * @returns {$data.Query}
 */

/**
 * Matches paths that identify nodes in a tree-like structure. A query is
 * composed of query components, each matching path component(s) in the
 * corresponding paths. Much like with `Path`, query components in the string
 * representation of the query are separated by the character '`.`' (period).
 * @class $data.Query
 * @mixes $utils.Cloneable
 * @implements $utils.Stringifiable
 * @implements $data.Matchable
 * @see $data.QueryComponent
 * @example
 * $data.Query.create(['foo', '*', 'bar:!baz,quux'])
 */
$data.Query = $oop.getClass('$data.Query')
.mix($utils.Cloneable)
.implement($utils.Stringifiable)
.implement($oop.getClass('$data.Matchable'))
.define(/** @lends $data.Query# */{
  /**
   * Query components.
   * @member {Array.<$data.QueryComponent>} $data.Query#components
   */

  /**
   * Creates a `Query` instance based on the specified component array.
   * @memberOf $data.Query
   * @param {Array.<$data.QueryComponent|string>} components
   * @returns {$data.Query}
   */
  fromComponents: function (components) {
    return this.create({components: components});
  },

  /**
   * Creates a `Query` instance based on the specified string.
   * @memberOf $data.Query
   * @param {string} queryStr
   * @returns {$data.Query}
   */
  fromString: function (queryStr) {
    var components = $utils.safeSplit(queryStr, $data.PATH_COMPONENT_SEPARATOR);
    return this.create({components: components});
  },

  /** @ignore */
  init: function () {
    $assert.isArray(this.components, "Invalid component list");

    var QueryComponent = $data.QueryComponent;

    // making sure all components are actually instances of $data.QueryComponent
    this.components = this.components
    .map(function (component) {
      return QueryComponent.mixedBy(component) ?
          component :
          QueryComponent.fromString(component);
    });
  },

  /**
   * Returns string representation of query. Special characters inside query
   * components will be escaped.
   * @returns {string}
   * @example
   * $data.Query.create(['foo.bar', '*:!baz.quux'])+''
   * // 'foo\.bar.*:!baz\.quux'
   */
  toString: function () {
    return this.components
    .map(String)
    .map($data.escapePathComponent)
    .join($data.PATH_COMPONENT_SEPARATOR);
  },

  /**
   * Matches query against a path.
   * @param {$data.Path} path
   * @returns {boolean}
   * @example
   * $data.Query.create(['**', 'baz'])
   *      .matches($data.Path.create(['foo', 'bar', 'baz'])) // true
   * $data.Query.create(['!foo', 'bar,baz'])
   *      .matches($data.Path.create(['foo', 'baz'])) // false
   */
  matches: function (path) {
    var queryComponents = this.components,
        queryComponentCount = queryComponents.length,
        pathComponents = path.components,
        pathComponentCount = pathComponents.length,
        i, currentQueryComponent, nextQueryComponent,
        j, currentPathComponent;

    for (i = 0, j = 0; i < queryComponentCount; i++, j++) {
      currentQueryComponent = queryComponents[i];
      if (currentQueryComponent.isSkipper) {
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
            // next query component matches current path component
            // keeping focus on current path component while letting query
            // component advance to next
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

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$data.Query} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isQuery: function (expr, message) {
    return $assert.assert(
        $data.Query.mixedBy(expr), message);
  },

  /**
   * @param {$data.Query} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isQueryOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $data.Query.mixedBy(expr), message);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$data.Query}
   */
  toQuery: function () {
    return $data.Query.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.Query}
   */
  toQuery: function () {
    return $data.Query.create({components: this});
  }
});
