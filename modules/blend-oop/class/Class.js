"use strict";

/**
 * @class $oop.Class
 */
$oop.Class = $oop.createObject(Object.prototype, /** @lends $oop.Class# */{
  /**
   * @member {number} $oop.Class#__classId
   */

  /**
   * @member {string} $oop.Class#__className
   */

  /**
   * @member {$oop.ClassBuilder} $oop.Class#__builder
   */

  /**
   * @param {Object} [properties]
   * @return {$oop.Class}
   */
  create: function (properties) {
    properties = properties || {};

    // merging down properties
    var argumentCount = arguments.length,
        i, propertyBatch,
        propertyNames, propertyCount,
        j, propertyName;
    for (i = 1; i < argumentCount; i++) {
      propertyBatch = arguments[i];
      if (propertyBatch) {
        propertyNames = Object.keys(propertyBatch);
        propertyCount = propertyNames.length;
        for (j = 0; j < propertyCount; j++) {
          propertyName = propertyNames[j];
          properties[propertyName] = propertyBatch[propertyName];
        }
      }
    }

    var that = this,
        forwards,
        forwardCount,
        forward,
        mixins;
    while (true) {
      forwards = that.__builder.forwards.list;
      forwardCount = forwards.length;
      mixins = [that];

      // obtaining suitable mixins
      for (i = 0; i < forwardCount; i++) {
        forward = forwards[i];
        if (forward.callback.call(that, properties)) {
          mixins.push(forward.mixin.Class);
        }
      }

      if (mixins.length > 1) {
        // mixing new class
        that = $oop.blendClass(mixins);
      } else {
        // no matching forwards found
        // going with last value of `that`
        break;
      }
    }

    // fetching cached instance
    var builder = that.__builder,
        mapper = builder.mapper,
        instances,
        instanceId, instance;
    if (mapper) {
      instances = builder.instances;
      instanceId = mapper.call(that, properties);
      instance = instances[instanceId];
      if (instance) {
        // instance found in cache
        return instance;
      }
    }

    // checking whether
    // ... methods match interfaces
    var unimplementedInterfaces = builder.unimplementedInterfaces;
    if (unimplementedInterfaces.length) {
      $assert.fail([
        "Class '" + that.__className + "' doesn't implement interface(s): " +
        unimplementedInterfaces
        .map($oop.addQuotes) + ".",
        "Can't instantiate."
      ].join(" "));
    }

    // ... expectations are satisfied
    var unmetExpectations = builder.unmetExpectations;
    if (unmetExpectations.length) {
      // there are unmet expectations - can't instantiate
      $assert.fail([
        "Class '" + that.__className + "' doesn't satisfy expectation(s): " +
        unmetExpectations
        .map($oop.getClassId)
        .map($oop.addQuotes)
        .join(",") + ".",
        "Can't instantiate."
      ].join(" "));
    }

    // instantiating class
    instance = Object.create(that);

    // copying initial properties to instance
    if (properties instanceof Object) {
      propertyNames = Object.getOwnPropertyNames(properties);
      propertyCount = propertyNames.length;
      for (i = 0; i < propertyCount; i++) {
        propertyName = propertyNames[i];
        instance[propertyName] = properties[propertyName];
      }
    } else {
      // invalid properties supplied
      $assert.fail([
        "Invalid properties supplied to class '" + that.__className + "'.",
        "Can't instantiate."
      ].join(" "));
    }

    // caching instance (if necessary)
    if (instanceId !== undefined) {
      instances[instanceId] = instance;
    }

    // setting defaults
    if (typeof instance.defaults === 'function') {
      instance.defaults();
    }

    // spreading properties - ie. dependencies bw. properties
    if (typeof instance.spread === 'function') {
      instance.spread();
    }

    // initializing instance
    if (typeof instance.init === 'function') {
      instance.init();
    }

    return instance;
  },

  /**
   * @param {Object} members
   * @return {$oop.Class}
   */
  delegate: function (members) {
    var builder = this.__builder;

    builder.delegate(members);

    $oop.copyProperties(this, members);

    builder.mixins.upstream.list
    .map(function (classBuilder) {
      return classBuilder.Class;
    })
    .filter(function (Class) {
      return Class !== undefined;
    })
    .forEach(function (Class) {
      $oop.copyProperties(Class, members);
    });

    return this;
  },

  /**
   * @param {$oop.Class} Class
   * @param {function} callback
   * @return {$oop.Class}
   */
  forwardBlend: function (Class, callback) {
    this.__builder.forwardBlend(Class, callback);
    return this;
  },

  /**
   * @param {$oop.Class} Interface
   * @return {boolean}
   */
  implements: function (Interface) {
    return Interface &&
        this.__builder.interfaces.downstream.lookup[Interface.__classId];
  },

  /**
   * @param {$oop.Class} Class
   * @return {boolean}
   */
  implementedBy: function (Class) {
    return Class &&
        Class.__builder.interfaces.downstream.lookup[this.__classId];
  },

  /**
   * @param {$oop.Class} Class
   * @return {boolean}
   * @todo Rename to isA() and add pure mixes() later.
   */
  mixes: function (Class) {
    return this === Class || Class.isPrototypeOf(this) ||
        $oop.Class.isPrototypeOf(Class) &&
        this.__builder.mixins.downstream.lookup[Class.__classId];
  },

  /**
   * @param {$oop.Class} Class
   * @return {boolean}
   * @todo Remove equality and replace w/ isA() throughout codebase.
   */
  mixedBy: function (Class) {
    return this === Class || this.isPrototypeOf(Class) ||
        $oop.Class.isPrototypeOf(Class) &&
        Class.__builder.mixins.downstream.lookup[this.__classId];
  },

  /**
   * @param {$oop.Class} Class
   * @return {boolean}
   */
  expects: function (Class) {
    return Class &&
        this.__builder.expectations.downstream.lookup[Class.__classId];
  },

  /**
   * @param {$oop.Class} Class
   * @return {boolean}
   */
  expectedBy: function (Class) {
    return Class &&
        Class.__builder.expectations.downstream.lookup[this.__classId];
  },

  /**
   * Binds and stores the specified methods on the instance, so they're
   * reusable as callbacks.
   * @param {...string} methodName
   * @return {$oop.Class}
   */
  elevateMethods: function (methodName) {
    var argumentCount = arguments.length,
        i;

    for (i = 0; i < argumentCount; i++) {
      methodName = arguments[i];
      this[methodName] = this[methodName].bind(this);
    }

    return this;
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$oop.Class} expr
   * @param {string} [message]
   * @return {$assert}
   */
  isClass: function (expr, message) {
    return $assert.assert(
        $oop.Class.isPrototypeOf(expr), message);
  },

  /**
   * @param {$oop.Class} [expr]
   * @param {string} [message]
   * @return {$assert}
   */
  isClassOoptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $oop.Class.isPrototypeOf(expr), message);
  },

  /**
   * @param {*} expr
   * @param {$oop.Class} Class
   * @param {string} [message]
   * @returns {$assert}
   */
  isInstanceOf: function (expr, Class, message) {
    return $assert.assert(
        Class.mixedBy(expr), message);
  },

  /**
   * @param {*} [expr]
   * @param {$oop.Class} Class
   * @param {string} [message]
   * @returns {$assert}
   */
  isInstanceOfOptional: function (expr, Class, message) {
    return $assert.assert(
        expr === undefined ||
        Class.mixedBy(expr), message);
  }
});
