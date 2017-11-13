"use strict";

/**
 * @function $data.TreeQuery.create
 * @param {Object} properties
 * @param {string[]} properties.components Series of patterns to match
 * corresponding path components.
 * @returns {$data.TreeQuery}
 */

/**
 * Matches paths that identify nodes in a tree structure. A query is composed
 * of query components, each matching path component(s) in the corresponding
 * paths. Much like with `Path`, query components in the string representation
 * of the query are separated by the character '`.`' (period).
 * @class $data.TreeQuery
 * @mixes $utils.Cloneable
 * @implements $utils.Stringifiable
 * @implements $data.Matchable
 * @see $data.TreeQueryComponent
 * @example
 * $data.TreeQuery.create(['foo', '*', 'bar:!baz,quux'])
 */
$data.TreeQuery = $oop.getClass('$data.TreeQuery')
.blend($utils.Cloneable)
.implement($utils.Stringifiable)
.implement($oop.getClass('$data.Matchable'))
.define(/** @lends $data.TreeQuery# */{
  /**
   * Query components.
   * @member {Array.<$data.TreeQueryComponent>} $data.TreeQuery#components
   */

  /**
   * Creates a `Query` instance based on the specified component array.
   * @memberOf $data.TreeQuery
   * @param {Array.<$data.TreeQueryComponent|string>} components
   * @param {Object} [properties]
   * @returns {$data.TreeQuery}
   */
  fromComponents: function (components, properties) {
    return this.create({components: components}, properties);
  },

  /**
   * Creates a `Query` instance based on the specified string.
   * @memberOf $data.TreeQuery
   * @param {string} queryStr
   * @param {Object} [properties]
   * @returns {$data.TreeQuery}
   */
  fromString: function (queryStr, properties) {
    var components = $utils.safeSplit(queryStr, $data.TREE_PATH_DELIMITER);
    return this.create({components: components}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isArray(this.components, "Invalid component list");

    var QueryComponent = $data.TreeQueryComponent;

    // making sure all components are actually instances of
    // $data.TreeQueryComponent
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
   * $data.TreeQuery.create(['foo.bar', '*:!baz.quux'])+''
   * // 'foo\.bar.*:!baz\.quux'
   */
  toString: function () {
    return this.components
    .map(String)
    .map($data.escapeTreePathComponent)
    .join($data.TREE_PATH_DELIMITER);
  },

  /**
   * Matches query against a path.
   * @param {$data.TreePath} path
   * @returns {boolean}
   * @example
   * $data.TreeQuery.create(['**', 'baz'])
   *      .matches($data.TreePath.create(['foo', 'bar', 'baz'])) // true
   * $data.TreeQuery.create(['!foo', 'bar,baz'])
   *      .matches($data.TreePath.create(['foo', 'baz'])) // false
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

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$data.TreeQuery}
   */
  toTreeQuery: function (properties) {
    return $data.TreeQuery.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$data.TreeQuery}
   */
  toTreeQuery: function (properties) {
    return $data.TreeQuery.create({components: this}, properties);
  }
});
