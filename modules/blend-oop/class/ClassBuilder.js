"use strict";

/**
 * Builds classes.
 * @class $oop.ClassBuilder
 */
$oop.ClassBuilder = $oop.createObject(Object.prototype, /** @lends $oop.ClassBuilder# */{
  /**
   * Identifies class.
   * @member {string} $oop.ClassBuilder#classId
   */

  /**
   * Properties and methods contributed by the current builder.
   * @member {Object} $oop.ClassBuilder#members
   */

  /**
   * Registry of classes mixed by the current class, and classes that mix
   * the current class.
   * @name $oop.ClassBuilder#mixins
   * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
   */

  /**
   * Registry of interfaces implemented by the current class, and classes
   * implementing the current class as an interface.
   * @name $oop.ClassBuilder#interfaces
   * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
   */

  /**
   * Registry of classes expected by the current class, and classes
   * expecting the current class.
   * @name $oop.ClassBuilder#expectations
   * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
   */

  /**
   * @memberOf $oop.ClassBuilder
   * @param {string} classId
   * @return {$oop.ClassBuilder}
   */
  create: function (classId) {
    $assert.isString(classId, "No class ID was specified.");

    return $oop.createObject(this, {
      classId: classId,
      Class: undefined,
      members: {},
      mixins: {
        downstream: {list: [], lookup: {}},
        upstream: {list: [], lookup: {}}
      },
      interfaces: {
        downstream: {list: [], lookup: {}},
        upstream: {list: [], lookup: {}}
      },
      expectations: {
        downstream: {list: [], lookup: {}},
        upstream: {list: [], lookup: {}}
      }
    });
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToMixins: function (classBuilder) {
    var mixins = this.mixins.downstream,
        mixinList = mixins.list,
        mixinLookup = mixins.lookup,
        mixinId = classBuilder.classId;

    if (!hOP.call(mixinLookup, mixinId)) {
      mixinList.push(classBuilder);
      mixinLookup[mixinId] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToHosts: function (classBuilder) {
    var hosts = this.mixins.upstream,
        hostList = hosts.list,
        hostLookup = hosts.lookup,
        hostId = classBuilder.classId;

    if (!hOP.call(hostLookup, hostId)) {
      hostList.push(classBuilder);
      hostLookup[hostId] = 1;
    }
  },

  /**
   * @return {Array.<$oop.ClassBuilder>}
   * @private
   */
  _flattenMixinTree: function () {
    var mixins = [],
        mixinLookup = {};

    (function traverseMixins(classBuilder) {
      classBuilder.mixins.downstream.list
      .forEach(function (mixinBuilder) {
        traverseMixins(mixinBuilder);

        if (!mixinLookup[mixinBuilder.classId]) {
          mixins.push(mixinBuilder);
          mixinLookup[mixinBuilder.classId] = 1;
        }
      });
    }(this));

    return mixins;
  },

  /**
   * @param {$oop.ClassBuilder} interfaceBuilder
   * @private
   */
  _addToInterfaces: function (interfaceBuilder) {
    var interfaces = this.interfaces.downstream,
        interfaceList = interfaces.list,
        interfaceLookup = interfaces.lookup,
        interfaceId = interfaceBuilder.classId;

    if (!hOP.call(interfaceLookup, interfaceId)) {
      interfaceList.push(interfaceBuilder);
      interfaceLookup[interfaceId] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToImplementers: function (classBuilder) {
    var implementers = this.interfaces.upstream,
        implementerList = implementers.list,
        implementerLookup = implementers.lookup,
        implementerId = classBuilder.classId;

    if (!hOP.call(implementerLookup, implementerId)) {
      implementerList.push(classBuilder);
      implementerLookup[implementerId] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToExpected: function (classBuilder) {
    var expected = this.expectations.downstream,
        expectedList = expected.list,
        expectedLookup = expected.lookup,
        expectedId = classBuilder.classId;

    if (!hOP.call(expectedLookup, expectedId)) {
      expectedList.push(classBuilder);
      expectedLookup[expectedId] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToExpecters: function (classBuilder) {
    var expecters = this.expectations.upstream,
        expecterList = expecters.list,
        expecterLookup = expecters.lookup,
        expecterId = classBuilder.classId;

    if (!hOP.call(expecterLookup, expecterId)) {
      expecterList.push(classBuilder);
      expecterLookup[expecterId] = 1;
    }
  },

  /**
   * Transfers expectations from specified class to the current class.
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _transferExpected: function (classBuilder) {
    var that = this;
    classBuilder.expectations.downstream.list
    .forEach(function (classBuilder) {
      that._addToExpected(classBuilder);
      classBuilder._addToExpecters(that);
    });
  },

  /**
   * Transfers mixins of the specified class to the current class.
   * @param {$oop.ClassBuilder} expectedBuilder
   * @private
   */
  _transferMixinsAsExpected: function (expectedBuilder) {
    var that = this;
    expectedBuilder.mixins.downstream.list
    .forEach(function (classBuilder) {
      that._addToExpected(classBuilder);
      classBuilder._addToExpecters(that);
    });
  },

  /**
   * @return {Array.<$oop.Klass>}
   * @private
   */
  _getUnimplementedInterfaces: function () {
    var members = this.members;

    return this.interfaces.downstream.list
    .filter(function (interfaceBuilder) {
      var interfaceMembers = interfaceBuilder.members;
      return Object.keys(interfaceMembers)
      .filter(function (property) {
        var interfaceMember = interfaceMembers[property];
        return typeof interfaceMember === 'function' &&
            typeof members[property] !== 'function';
      }).length;
    });
  },

  /**
   * @return {Array.<$oop.Klass>}
   * @private
   */
  _getUnmetExpectations: function () {
    var mixinLookup = this.mixins.downstream.lookup;

    return this.expectations.downstream.list
    .filter(function (expectedBuilder) {
      return !mixinLookup[expectedBuilder.classId];
    });
  },

  /**
   * @return {Object}
   * @private
   */
  _extractMemberMatrix: function () {
    return this.mixins.downstream.list
    .concat([this])
    .map(function (classBuilder) {
      return classBuilder.members;
    })
    .reduce(function (memberMatrix, mixinMembers) {
      Object.keys(mixinMembers)
      .forEach(function (property) {
        if (!memberMatrix[property]) {
          memberMatrix[property] = [];
        }
        memberMatrix[property].push(mixinMembers[property]);
      });
      return memberMatrix;
    }, {});
  },

  /**
   * @param {string} property
   * @param {Array.<function>} methods
   * @return {function}
   * @private
   */
  _mergeMethods: function (property, methods) {
    var methodCount = methods.length,
        result;

    if (property === 'defaults') {
      // setting up defaults to be called in reversed order, so more
      // specific classes take effect first
      methods.reverse();
    }

    if (methodCount === 1) {
      result = methods[0];
    } else {
      result = function wrapped() {
        var i, method, result,
            sharedBefore = wrapped.shared,
            shared = {};

        wrapped.shared = shared;

        for (i = 0; i < methodCount; i++) {
          method = methods[i];
          method.shared = shared;
          method.returned = result;
          // todo Pass first n args instead of apply for performance?
          result = method.apply(this, arguments);
          method.shared = sharedBefore;
        }

        wrapped.shared = sharedBefore;

        return result;
      };
    }

    result.shared = {};

    return result;
  },

  /**
   * Merges variables by picking the last one. (Override)
   * @param {string} property
   * @param {Array.<*>} variables
   * @return {*}
   * @private
   */
  _mergeProperties: function (property, variables) {
    // todo We should allow the developer to specify custom merge strategies
    return variables[variables.length - 1];
  },

  /**
   * @private
   */
  _mergeMembers: function (Class) {
    var that = this,
        memberMatrix = this._extractMemberMatrix();

    Object.keys(memberMatrix)
    .forEach(function (property) {
      var memberVariants = memberMatrix[property],
          memberSample = memberVariants[0];
      if (typeof memberSample === 'function') {
        Class[property] = that._mergeMethods(property, memberVariants);
      } else {
        Class[property] = that._mergeProperties(property, memberVariants);
      }
    });
  },

  /**
   * Defines properties and methods to be contributed by the current class.
   * May be called multiple times, but conflicting members will overwrite
   * previous ones.
   * @param {Object} members
   * @return {$oop.ClassBuilder}
   */
  define: function (members) {
    $assert.isObject(members, "No members specified.");

    var that = this;

    Object.keys(members)
    .forEach(function (property) {
      that.members[property] = members[property];
    });

    return this;
  },

  /**
   * @param {Object} properties
   * @return {$oop.ClassBuilder}
   */
  delegate: function (properties) {

  },

  /**
   * Mixes specified mixin to the current class.
   * @param {$oop.Klass} Class
   * @return {$oop.ClassBuilder}
   */
  mix: function (Class) {
    $assert.isKlass(Class, "Expecting Klass instance");

    var classBuilder = Class.__builder;

    this._addToMixins(classBuilder);
    classBuilder._addToHosts(this);
    this._transferExpected(classBuilder);

    return this;
  },

  /**
   * Mixes specified class and all its mixins, direct or indirect, to the
   * current class.
   * @param {$oop.Klass} Class
   * @return {$oop.ClassBuilder}
   */
  blend: function (Class) {
    $assert.isKlass(Class, "Expecting Klass instance");

    var that = this,
        classBuilder = Class.__builder;

    classBuilder._flattenMixinTree()
    .forEach(function (mixinBuilder) {
      that.mix(mixinBuilder.Class);
    });
    this.mix(Class);

    return this;
  },

  /**
   * Specifies an interface to be implemented by the host class. Building the
   * class will throw on unimplemented interface methods.
   * @param {$oop.Klass} Interface
   * @return {$oop.ClassBuilder}
   */
  implement: function (Interface) {
    $assert.isKlass(Interface, "Expecting Klass instance");

    var interfaceBuilder = Interface.__builder;

    this._addToInterfaces(interfaceBuilder);
    interfaceBuilder._addToImplementers(this);

    return this;
  },

  /**
   * @param {$oop.Klass} Class
   * @return {$oop.ClassBuilder}
   */
  expect: function (Class) {
    $assert.isKlass(Class, "Expecting Klass instance");

    var classBuilder = Class.__builder;

    this._addToExpected(classBuilder);
    classBuilder._addToExpecters(this);
    this._transferMixinsAsExpected(classBuilder);

    return this;
  },

  /**
   * @param {function} mapper
   * @return {$oop.ClassBuilder}
   */
  cacheBy: function (mapper) {

  },

  /**
   * Builds class based on the current state of the builder. Can only be
   * called once per builder, otherwise throws exception.
   * @return {$oop.Klass}
   */
  build: function () {
    $assert.isUndefined(this.Class, "Class already built");

    var classId = this.classId;

    // creating Class object
    var Class = $oop.createObject($oop.Klass, {
      __classId: classId,
      __builder: this
    });

    // adding finalized information to builder
    $oop.copyProperties(this, {
      Class: Class,
      unimplementedInterfaces: this._getUnimplementedInterfaces(),
      unmetExpectations: this._getUnmetExpectations()
    });

    // storing class in global lookup
    $oop.klassByClassId[classId] = Class;

    // merging down class members
    this._mergeMembers(Class);

    return Class;
  }
});

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * @type {Object}
   */
  klassByClassId: {},

  /**
   * @param {string} classId
   * @return {$oop.ClassBuilder}
   */
  createClass: function (classId) {
    return $oop.ClassBuilder.create(classId);
  }
});
