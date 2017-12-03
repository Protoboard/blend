"use strict";

/**
 * @class $oop.Klass
 * @todo Rename when replacing $oop.Class
 */
$oop.Klass = $oop.createObject(Object.prototype, /** @lends $oop.Klass# */{
  /**
   * @member {string} $oop.Klass#__className
   */

  /**
   * @member {$oop.ClassBuilder} $oop.Klass#__builder
   */

  /**
   * @param {Object} properties
   * @return {$oop.Klass}
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

    // todo Add forwarding
    var that = this;

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
   * @return {$oop.Klass}
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
   * @param {$oop.Klass} Class
   * @param {function} callback
   * @return {$oop.Klass}
   */
  forwardBlend: function (Class, callback) {
    this.__builder.forwardBlend(Class, callback);
    return this;
  },

  /**
   * @param {$oop.Klass} Interface
   * @return {boolean}
   */
  implements: function (Interface) {
    return Interface &&
        this.__builder.interfaces.downstream.lookup[Interface.__className];
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  implementedBy: function (Class) {
    return Class &&
        Class.__builder.interfaces.downstream.lookup[this.__className];
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  mixes: function (Class) {
    return Class && this.__builder.mixins.downstream.lookup[Class.__className];
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  mixedBy: function (Class) {
    return Class && Class.__builder.mixins.downstream.lookup[this.__className];
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  expects: function (Class) {
    return Class &&
        this.__builder.expectations.downstream.lookup[Class.__className];
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  expectedBy: function (Class) {
    return Class &&
        Class.__builder.expectations.downstream.lookup[this.__className];
  },

  /**
   * Binds and stores the specified methods on the instance, so they're
   * reusable as callbacks.
   * @param {...string} methodName
   * @return {$oop.Klass}
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
   * @param {$oop.Klass} expr
   * @param {string} [message]
   * @return {$assert}
   */
  isKlass: function (expr, message) {
    return $assert.assert(
        $oop.Klass.isPrototypeOf(expr), message);
  },

  /**
   * @param {$oop.Klass} [expr]
   * @param {string} [message]
   * @return {$assert}
   */
  isKlassOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $oop.Klass.isPrototypeOf(expr), message);
  }
});
