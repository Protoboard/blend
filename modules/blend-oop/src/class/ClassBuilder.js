"use strict";

/**
 * Builds classes.
 * @class $oop.ClassBuilder
 * @todo Add mixes()
 * @todo Move defaults, spread, & init outside of Class?
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
   * Callback methods contributed by current class.
   * @member {Object} $oop.ClassBuilder#callbacks
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
   * Registry of classes that contribute to the current class. Includes
   * downstream mixins and self, except ad-hoc classes.
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
      callbacks: {},
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
      return !mixinLookup[expectedBuilder.classId];
    });
  },

  /**
   * Extracts a matrix of members contributed by the current class and its
   * mixins. Indexed by member name, then ordered according to mixin order.
   * @return {Object}
   * @private
   */
  _extractMemberMatrix: function (membersPropertyName) {
    return this.mixins.downstream.list
    .concat([this])
    .map(function (classBuilder) {
      return classBuilder[membersPropertyName];
    })
    .reduce(function (memberMatrix, mixinMembers) {
      Object.keys(mixinMembers)
      .forEach(function (propertyName) {
        if (!hOP.call(memberMatrix, propertyName)) {
          memberMatrix[propertyName] = [];
        }
        memberMatrix[propertyName].push(mixinMembers[propertyName]);
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
      result = function methodWrapper() {
        var i, method, result,
            sharedBefore = methodWrapper.shared,
            shared = {};

        methodWrapper.shared = shared;

        for (i = 0; i < methodCount; i++) {
          method = methods[i];
          method.shared = shared;
          method.returned = result;
          // todo Pass first n args instead of apply for performance?
          result = method.apply(this, arguments);
          method.shared = sharedBefore;
        }

        methodWrapper.shared = sharedBefore;

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
   * @param {string} membersPropertyName
   * @private
   */
  _mergeMembers: function (membersPropertyName) {
    var that = this,
        memberMatrix = this._extractMemberMatrix(membersPropertyName);

    return Object.keys(memberMatrix)
    .reduce(function (members, propertyName) {
      var memberVariants = memberMatrix[propertyName],
          memberSample = memberVariants[0];
      if (typeof memberSample === 'function') {
        members[propertyName] = that._mergeMethods(propertyName, memberVariants);
      } else {
        members[propertyName] = that._mergeProperties(propertyName, memberVariants);
      }
      return members;
    }, {});
  },

  /**
   * @param {$oop.ClassBuilder} mixinBuilder
   * @param {function} callback
   * @private
   */
  _addToForwards: function (mixinBuilder, callback) {
    var forwards = this.forwards,
        forwardId = mixinBuilder.classId,
        forwardList = forwards.list,
        forwardLookup = forwards.lookup;

    if (!forwardLookup[forwardId]) {
      forwardList.push({
        mixin: mixinBuilder,
        callback: callback
      });
      forwardLookup[forwardId] = 1;
    }
  },

  /**
   * @param {$oop.ClassBuilder} mixinBuilder
   * @private
   */
  _removeFromForwards: function (mixinBuilder) {
    var forwards = this.forwards,
        forwardId = mixinBuilder.classId,
        forwardList = forwards.list,
        forwardLookup = forwards.lookup,
        forwardCount = forwardList.length,
        i;

    for (i = 0; i < forwardCount; i++) {
      if (forwardList[i].mixin === mixinBuilder) {
        forwardList.splice(i, 1);
        delete forwardLookup[forwardId];
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
          !mixinLookup1[forwardMixin.classId];
    })
    .forEach(function (forward) {
      that._addToForwards(forward.mixin, forward.callback);
    });

    this.forwards.list
    .filter(function (forward) {
      var forwardMixin = forward.mixin;
      return forwardMixin === classBuilder ||
          mixinLookup2[forwardMixin.classId];
    })
    .forEach(function (forward) {
      that._removeFromForwards(forward.mixin);
    });
  },

  /**
   * @private
   */
  _applyMembers: function () {
    $oop.copyProperties(this.Class, this._mergeMembers('members'));
  },

  /**
   * @private
   */
  _applyDelegates: function () {
    $oop.copyProperties(this.Class, this.delegates);
  },

  /**
   * @private
   */
  _applyCustomBuild: function () {
    var callbacks = this._mergeMembers('callbacks'),
        build = callbacks.build;
    if (build) {
      build.call(this.Class);
    }
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
   * Defines callback methods to be invoked on build or instantiation.
   * @param {Object.<string,function>} callbacks
   * @return {$oop.ClassBuilder}
   */
  setup: function (callbacks) {
    $assert.isObject(callbacks,
        this.className + "#callback() expects type Object, got " + typeof callbacks);
    $oop.copyProperties(this.callbacks, callbacks);
    return this;
  },

  /**
   * Mixes specified mixin to the current class.
   * @param {$oop.Class} Class
   * @return {$oop.ClassBuilder}
   */
  mix: function (Class) {
    $assert.isClass(Class,
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
    $assert.isClass(Class,
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
    $assert.isClass(Interface,
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
    $assert.isClass(Class,
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
        contributors = this.mixins.downstream.list.concat(this)
        .filter(function (mixinBuilder) {
          return mixinBuilder.className !== undefined;
        });

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

    // finalizing class members
    this._applyMembers();
    this._applyDelegates();
    this._applyCustomBuild();

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
    $assert.isClass(Mixin,
        this.className + "#forwardBlend() expects type Class, got " + typeof Mixin);

    var mixinBuilder = Mixin.__builder;
    this._addToForwards(mixinBuilder, callback);
    this.mixins.upstream.list
    .filter(function (mixerBuilder) {
      // only mixers that don't already mix Mixin
      return mixerBuilder !== mixinBuilder &&
          !mixerBuilder.mixins.downstream.lookup[mixinBuilder.classId];
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
