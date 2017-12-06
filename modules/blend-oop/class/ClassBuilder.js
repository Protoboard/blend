"use strict";

/**
 * Builds classes.
 * @class $oop.ClassBuilder
 */
$oop.ClassBuilder = $oop.createObject(Object.prototype, /** @lends $oop.ClassBuilder# */{
  /**
   * Globally identifies class.
   * @member {number} $oop.ClassBuilder#classId
   */

  /**
   * Identifies class to user.
   * @member {string} $oop.ClassBuilder#className
   */

  /**
   * Reference to built class.
   * @member {$oop.Class} $oop.ClassBuilder#Class
   */

  /**
   * Properties and methods contributed by the current class.
   * @member {Object} $oop.ClassBuilder#members
   */

  /**
   * Properties and methods delegated to the current class.
   * @member {Object} $oop.ClassBuilder#delegates
   */

  /**
   * Registry of classes mixed by the current class, and classes that mix
   * the current class.
   * @name $oop.ClassBuilder#mixins
   * @type {{downstream:$oop.QuickList,upstream:$oop.QuickList}}
   */

  /**
   * Registry of classes that contribute to the current class.
   * @name $oop.ClassBuilder#contributors
   * @type {Array.<$oop.ClassBuilder>}
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
   * Hash function for caching instances.
   * @name $oop.ClassBuilder#mapper
   * @type {function}
   */

  /**
   * Lookup of cached instances indexed by hash.
   * @name $oop.ClassBuilder#instances
   * @type {Object}
   */

  /**
   * Registry of forward descriptors. Forwards define additional mixins to be
   * mixed to classes when environment or initial properties meet the
   * specified condition.
   * @name $oop.ClassBuilder#forwards
   * @type {$oop.QuickList}
   */

  /**
   * @memberOf $oop.ClassBuilder
   * @type {number}
   */
  lastClassId: -1,

  /**
   * @memberOf $oop.ClassBuilder
   * @param {string} [className]
   * @return {$oop.ClassBuilder}
   */
  create: function (className) {
    return $oop.createObject(this, {
      classId: ++$oop.ClassBuilder.lastClassId,
      className: className,
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
      },
      mapper: undefined,
      instances: {},
      delegates: {},
      forwards: {list: [], lookup: {}}
    });
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _transferMapperFrom: function (classBuilder) {
    if (classBuilder.mapper) {
      // todo Merge mappers?
      this.mapper = classBuilder.mapper;
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _transferDelegatesFrom: function (classBuilder) {
    $oop.copyProperties(this.delegates, classBuilder.delegates);
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _addToMixins: function (classBuilder) {
    var mixins = this.mixins.downstream,
        mixinList = mixins.list,
        mixinLookup = mixins.lookup,
        mixinName = classBuilder.className;

    if (!hOP.call(mixinLookup, mixinName)) {
      mixinList.push(classBuilder);
      mixinLookup[mixinName] = 1;
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
        hostName = classBuilder.className;

    if (!hOP.call(hostLookup, hostName)) {
      hostList.push(classBuilder);
      hostLookup[hostName] = 1;
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

        if (!mixinLookup[mixinBuilder.className]) {
          mixins.push(mixinBuilder);
          mixinLookup[mixinBuilder.className] = 1;
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
        interfaceName = interfaceBuilder.className;

    if (!hOP.call(interfaceLookup, interfaceName)) {
      interfaceList.push(interfaceBuilder);
      interfaceLookup[interfaceName] = 1;
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
        implementerName = classBuilder.className;

    if (!hOP.call(implementerLookup, implementerName)) {
      implementerList.push(classBuilder);
      implementerLookup[implementerName] = 1;
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
        expectedName = classBuilder.className;

    if (!hOP.call(expectedLookup, expectedName)) {
      expectedList.push(classBuilder);
      expectedLookup[expectedName] = 1;
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
        expecterName = classBuilder.className;

    if (!hOP.call(expecterLookup, expecterName)) {
      expecterList.push(classBuilder);
      expecterLookup[expecterName] = 1;
    }
  },

  /**
   * Transfers expectations from specified class to the current class.
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _transferExpectedFrom: function (classBuilder) {
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
  _transferMixinsAsExpectedFrom: function (expectedBuilder) {
    var that = this;
    expectedBuilder.mixins.downstream.list
    .forEach(function (classBuilder) {
      that._addToExpected(classBuilder);
      classBuilder._addToExpecters(that);
    });
  },

  /**
   * @return {Array.<$oop.Class>}
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
   * @return {Array.<$oop.Class>}
   * @private
   */
  _getUnmetExpectations: function () {
    var mixinLookup = this.mixins.downstream.lookup;

    return this.expectations.downstream.list
    .filter(function (expectedBuilder) {
      return !mixinLookup[expectedBuilder.className];
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
        if (!hOP.call(memberMatrix, property)) {
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
   * @param {$oop.Class} Class
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
   * @param {$oop.Class} Class
   * @private
   */
  _applyDelegates: function (Class) {
    $oop.copyProperties(Class, this.delegates);
  },

  /**
   * @param {$oop.ClassBuilder} mixinBuilder
   * @param {function} callback
   * @private
   */
  _addToForwards: function (mixinBuilder, callback) {
    var forwards = this.forwards,
        forwardName = mixinBuilder.className,
        forwardList = forwards.list,
        forwardLookup = forwards.lookup;

    if (!forwardLookup[forwardName]) {
      forwardList.push({
        mixin: mixinBuilder,
        callback: callback
      });
      forwardLookup[forwardName] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} mixinBuilder
   * @private
   */
  _removeFromForwards: function (mixinBuilder) {
    var forwards = this.forwards,
        forwardName = mixinBuilder.className,
        forwardList = forwards.list,
        forwardLookup = forwards.lookup,
        forwardCount = forwardList.length,
        i;

    for (i = 0; i < forwardCount; i++) {
      if (forwardList[i].mixin === mixinBuilder) {
        forwardList.splice(i, 1);
        delete forwardLookup[forwardName];
        break;
      }
    }
  },

  /**
   * @param {$oop.ClassBuilder} classBuilder
   * @private
   */
  _transferForwardsFrom: function (classBuilder) {
    var that = this,
        mixinLookup1 = this.mixins.downstream.lookup,
        mixinLookup2 = classBuilder.mixins.downstream.lookup;

    classBuilder.forwards.list
    .filter(function (forward) {
      var forwardMixin = forward.mixin;
      return forwardMixin !== that &&
          !mixinLookup1[forwardMixin.className];
    })
    .forEach(function (forward) {
      that._addToForwards(forward.mixin, forward.callback);
    });

    this.forwards.list
    .filter(function (forward) {
      var forwardMixin = forward.mixin;
      return forwardMixin === classBuilder ||
          mixinLookup2[forwardMixin.className];
    })
    .forEach(function (forward) {
      that._removeFromForwards(forward.mixin);
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
    $assert.isObject(members,
        this.className + "#define() expects type Object, got " + typeof members);
    $oop.copyProperties(this.members, members);
    return this;
  },

  /**
   * Mixes specified mixin to the current class.
   * @param {$oop.Class} Class
   * @return {$oop.ClassBuilder}
   */
  mix: function (Class) {
    $assert.isKlass(Class,
        this.className + "#mix() expects type Class, got " + typeof Class);

    var classBuilder = Class.__builder;

    this._addToMixins(classBuilder);
    classBuilder._addToHosts(this);
    this._transferExpectedFrom(classBuilder);
    this._transferMapperFrom(classBuilder);
    this._transferDelegatesFrom(classBuilder);
    this._transferForwardsFrom(classBuilder);

    return this;
  },

  /**
   * Mixes specified class and all its mixins, direct or indirect, to the
   * current class.
   * @param {$oop.Class} Class
   * @return {$oop.ClassBuilder}
   */
  blend: function (Class) {
    $assert.isKlass(Class,
        this.className + "#blend() expects type Class, got " + typeof Class);

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
   * @param {$oop.Class} Interface
   * @return {$oop.ClassBuilder}
   */
  implement: function (Interface) {
    $assert.isKlass(Interface,
        this.className + "#implement() expects type Class, got " + typeof Interface);

    var interfaceBuilder = Interface.__builder;

    this._addToInterfaces(interfaceBuilder);
    interfaceBuilder._addToImplementers(this);

    return this;
  },

  /**
   * @param {$oop.Class} Class
   * @return {$oop.ClassBuilder}
   */
  expect: function (Class) {
    $assert.isKlass(Class,
        this.className + "#expect() expects type Class, got " + typeof Class);

    var classBuilder = Class.__builder;

    this._addToExpected(classBuilder);
    classBuilder._addToExpecters(this);
    this._transferMixinsAsExpectedFrom(classBuilder);

    return this;
  },

  /**
   * @param {function} mapper
   * @return {$oop.ClassBuilder}
   */
  cacheBy: function (mapper) {
    $assert.isFunction(mapper,
        this.className + "#cacheBy() expects type function, got " + typeof mapper);
    this.mapper = mapper;
    return this;
  },

  /**
   * Builds class based on the current state of the builder. Can only be
   * called once per builder, otherwise throws exception.
   * @return {$oop.Class}
   */
  build: function () {
    $assert.isUndefined(this.Class,
        this.className + "#build() can't build. Class already built.");

    // creating Class object
    var classId = this.classId,
        className = this.className,
        Class = $oop.createObject($oop.Class, {
          __classId: classId,
          __className: className,
          __builder: this
        }),
        contributors = this.mixins.downstream.list.concat(this);

    // adding finalized information to builder
    $oop.copyProperties(this, {
      Class: Class,
      contributors: contributors,
      unimplementedInterfaces: this._getUnimplementedInterfaces(),
      unmetExpectations: this._getUnmetExpectations()
    });

    // storing class in global lookups
    $oop.classes.push(Class);
    $oop.classByClassId[classId] = Class;
    if (className !== undefined) {
      $oop.classByClassName[className] = Class;
    }
    if (contributors.length > 1) {
      $oop.BlenderIndex.addClass(Class);
    }

    // finalizing members
    this._mergeMembers(Class);
    this._applyDelegates(Class);

    return Class;
  },

  /**
   * @param {Object} members
   * @return {$oop.ClassBuilder}
   */
  delegate: function (members) {
    $assert.isObject(members,
        this.className + "#delegate() expects type Object, got " + typeof members);

    var that = this;
    $oop.copyProperties(this.delegates, members);
    this.mixins.upstream.list
    .forEach(function (mixer) {
      mixer._transferDelegatesFrom(that);
    });

    return this;
  },

  /**
   * @param {$oop.Class} Mixin
   * @param {function} callback
   * @return {$oop.ClassBuilder}
   * @todo Make callback optional / accept boolean?
   */
  forwardBlend: function (Mixin, callback) {
    $assert.isKlass(Mixin,
        this.className + "#forwardBlend() expects type Class, got " + typeof Mixin);

    var mixinBuilder = Mixin.__builder;
    this._addToForwards(mixinBuilder, callback);
    this.mixins.upstream.list
    .filter(function (mixerBuilder) {
      // only mixers that don't already mix Mixin
      return mixerBuilder !== mixinBuilder &&
          !mixerBuilder.mixins.downstream.lookup[mixinBuilder.className];
    })
    .forEach(function (mixerBuilder) {
      mixerBuilder._addToForwards(mixinBuilder, callback);
    });

    return this;
  }
});

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * @type {Array.<$oop.Class>}
   */
  classes: [],

  /**
   * @type {Object.<string,$oop.Class>}
   */
  classByClassId: {},

  /**
   * @type {Object.<string,$oop.Class>}
   */
  classByClassName: {},

  /**
   * @param {string} [className]
   * @return {$oop.ClassBuilder}
   */
  createClass: function (className) {
    return $oop.ClassBuilder.create(className);
  }
});
