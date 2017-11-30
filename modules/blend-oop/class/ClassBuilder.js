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
      }
    });
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToDownstreamMixins: function (classBuilder) {
    var mixins = this.mixins.downstream,
        mixinList = mixins.list,
        mixinLookup = mixins.lookup,
        classId = classBuilder.classId;

    if (!hOP.call(mixinLookup, classId)) {
      mixinList.push(classBuilder);
      mixinLookup[classId] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToUpstreamMixins: function (classBuilder) {
    var hosts = this.mixins.upstream,
        hostList = hosts.list,
        hostLookup = hosts.lookup,
        classId = classBuilder.classId;

    if (!hOP.call(hostLookup, classId)) {
      hostList.push(classBuilder);
      hostLookup[classId] = 1;
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
   * @param {$oop.Klass} Class
   * @return {$oop.ClassBuilder}
   */
  mix: function (Class) {
    $assert.isKlass(Class, "Expecting Klass instance");

    var classBuilder = Class.__builder;

    this._addToDownstreamMixins(classBuilder);
    classBuilder._addToUpstreamMixins(this);

    return this;
  },

  /**
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
   * @param {$oop.Class} Interface
   * @return {$oop.ClassBuilder}
   */
  implement: function (Interface) {

  },

  /**
   * @param {$oop.Class} Class
   * @return {$oop.ClassBuilder}
   */
  expect: function (Class) {

  },

  /**
   * @param {function} mapper
   * @return {$oop.ClassBuilder}
   */
  cacheBy: function (mapper) {

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
   * Builds class based on the current state of the builder. Can only be
   * called once per builder, otherwise throws exception.
   * @return {$oop.Klass}
   */
  build: function () {
    $assert.isUndefined(this.Class, "Class already built");

    var classId = this.classId,
        Class = $oop.createObject($oop.Klass, {
          __classId: classId,
          __builder: this
        });

    // storing class on builder (self)
    this.Class = Class;

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
