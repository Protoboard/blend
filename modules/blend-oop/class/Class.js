"use strict";

/**
 * Composable class.
 * @class $oop.Class
 */
$oop.Class = $oop.createObject(Object.prototype, /** @lends $oop.Class# */{
  /**
   * Copies batch of members to class members container.
   * @param {object} batch
   * @private
   */
  _addToMembers: function (batch) {
    var members = this.__members;

    Object.getOwnPropertyNames(batch)
    .forEach(function (memberName) {
      // todo Throw on conflict?
      members[memberName] = batch[memberName];
    });
  },

  /**
   * Copies batch of members to class members container. Overwrites
   * conflicting properties.
   * @param {object} batch
   * @private
   */
  _addToDelegates: function (batch) {
    var delegates = this.__delegates;

    Object.getOwnPropertyNames(batch)
    .forEach(function (memberName) {
      // todo Throw on conflict?
      delegates[memberName] = batch[memberName];
    });
  },

  /**
   * Adds class to list of contributors.
   * @param {$oop.Class} Class Contributing class
   * @param {$oop.Class} [Next] Class before which the contributing class
   *     should be placed.
   * @private
   */
  _addToContributors: function (Class, Next) {
    var contributors = this.__contributors,
        contributorList = contributors.list,
        contributorLookup = contributors.lookup,
        classId = Class.__classId;

    if (!hOP.call(contributorLookup, classId)) {
      if (Next) {
        // placing mixin before Next class, and reconstructing lookup
        contributorList.splice(contributorList.indexOf(Next), 0, Class);
        contributors.lookup = contributorList
        .reduce(function (lookup, Class, i) {
          lookup[Class.__classId] = i;
          return lookup;
        }, {});
      } else {
        // adding mixin
        contributorLookup[classId] = contributorList.length;
        contributorList.push(Class);
      }
    }
  },

  /**
   * Inserts empty slots into a `MemberMatrix` structure at the specified
   * `Next` class when and only when `Class` is not a contributor yet. Expects
   * contributors not to be updated yet.
   * @param {$oop.MemberMatrix} memberMatrix
   * @param {$oop.Class} Class
   * @param {$oop.Class} [Next]
   * @private
   */
  _updateMemberMatrix: function (memberMatrix, Class, Next) {
    var contributorLookup = this.__contributors.lookup,
        classId = Class.__classId,
        nextIndex;

    if (!hOP.call(contributorLookup, classId)) {
      if (Next) {
        nextIndex = contributorLookup[Next.__classId];

        // through class is defined
        // making room for incoming methods
        Object.getOwnPropertyNames(memberMatrix)
        .filter(function (methodName) {
          var methods = memberMatrix[methodName];
          return methods && methods.length > nextIndex;
        })
        .forEach(function (methodName) {
          var methods = memberMatrix[methodName];
          methods.splice(nextIndex, 0, undefined);
        });
      }
    }
  },

  /**
   * Adds members to the specified member lookup, indexed by method name, then
   * contribution order. Expects contributors to be up to date, and
   * memberMatrix to be prepared.
   * @param {$oop.MemberMatrix} memberMatrix
   * @param {object} members Contributed members (may contain properties)
   * @param {string} classId ID of contributing class
   * @private
   */
  _addToMemberMatrix: function (memberMatrix, members, classId) {
    var contributorLookup = this.__contributors.lookup,
        classIndex = contributorLookup[classId];

    // just setting members in method matrix
    Object.getOwnPropertyNames(members)
    .forEach(function (memberName) {
      var methods;
      if (hOP.call(memberMatrix, memberName)) {
        methods = memberMatrix[memberName];
      } else {
        methods = memberMatrix[memberName] = [];
      }
      methods[classIndex] = members[memberName];
    });
  },

  /**
   * Adds methods to method lookup, indexed by method name, then order.
   * @param {object} members Contributed members (may contain properties)
   * @param {string} classId ID of contributing class
   * @private
   */
  _addMethodsToMatrix: function (members, classId) {
    // todo Break out method extractor?
    var methods = Object.getOwnPropertyNames(members)
    .filter(function (memberName) {
      return typeof members[memberName] === 'function';
    })
    .reduce(function (result, methodName) {
      result[methodName] = members[methodName];
      return result;
    }, {});

    this._addToMemberMatrix(this.__methodMatrix, methods, classId);
  },

  /**
   * Adds methods to method lookup, indexed by method name, then order.
   * @param {object} members Contributed members (may contain properties)
   * @param {string} classId ID of contributing class
   * @private
   */
  _addPropertiesToMatrix: function (members, classId) {
    // todo Break out property extractor?
    var Class = $oop.Class,
        that = this,
        properties = Object.getOwnPropertyNames(members)
        .filter(function (memberName) {
          return typeof members[memberName] !== 'function';
        })
        .reduce(function (result, propertyName) {
          result[propertyName] = members[propertyName];
          return result;
        }, {});

    // making sure no static property is a Class instance
    Object.getOwnPropertyNames(properties)
    .forEach(function (propertyName) {
      var propertyValue = properties[propertyName];
      if (Class.isPrototypeOf(propertyValue) &&
          Object.getPrototypeOf(propertyValue) !== Class
      ) {
        $assert.fail([
          "Instance not allowed as static property value for '" +
          that.__classId + "." + propertyName + "'.",
          "Can't build."
        ].join(" "));
      }
    });

    this._addToMemberMatrix(this.__propertyMatrix, properties, classId);
  },

  /**
   * Adds properties to class.
   * @param {object} members
   * @private
   */
  _addPropertiesToClass: function (members) {
    var that = this,
        propertyMatrix = this.__propertyMatrix;

    Object.getOwnPropertyNames(members)
    .filter(function (memberName) {
      return typeof members[memberName] !== 'function';
    })
    .forEach(function (propertyName) {
      // calculating property value based on __propertyMatrix
      // todo We should be able to pass in property type checker & reducer
      that[propertyName] = propertyMatrix[propertyName]
      .reduce(function (curr, next) {
        // todo This would be the default reducer for untyped properties
        return next !== undefined ? next : curr;
      });
    });
  },

  /**
   * Adds wrapper methods for functions contributed to the class. Wrapper
   * methods cycle through versions of the same method, and call them in the
   * order of contributions. For performance reasons, wrapper methods return
   * the result of the last call. It's the responsibility of each contributed
   * method to ensure access to its individual return value, if needed.
   * @param {object} members
   * @private
   * @todo Add tests for wrapper invocation
   */
  _addWrapperMethodsToClass: function (members) {
    var that = this;

    // adding / replacing wrapper method for existing methods
    Object.getOwnPropertyNames(members)
    .filter(function (memberName) {
      return typeof members[memberName] === 'function';
    })
    .forEach(function (methodName) {
      // compacting method array
      var methodMatrix = that.__methodMatrix,
          compactedMethods = methodMatrix[methodName]
          .filter(function (method) {
            return method !== undefined;
          }),
          methodCount = compactedMethods.length,
          shared = {};

      if (methodName === 'defaults') {
        // setting up defaults to be called in reversed order, so more
        // specific classes take effect first
        compactedMethods.reverse();
      }

      if (methodCount === 1) {
        // exposing standalone function
        that[methodName] = compactedMethods[0];
      } else if (methodCount > 1) {
        // decorating & wrapping individual methods
        that[methodName] = function wrapper() {
          var i, method, result;

          // calling functions in order of contributions
          for (i = 0; i < methodCount; i++) {
            method = compactedMethods[i];
            method.shared = shared;
            method.returned = result;
            result = method.apply(this, arguments);
          }

          return result;
        };
      }

      // adding shared container to both wrapper and standalone for
      // compatibility
      that[methodName].shared = shared;
    });
  },

  /**
   * @param {$oop.Class} Interface
   * @private
   */
  _addToInterfaces: function (Interface) {
    var interfaces = this.__interfaces.downstream,
        interfaceList = interfaces.list,
        interfaceLookup = interfaces.lookup,
        interfaceId = Interface.__classId;

    if (!hOP.call(interfaceLookup, interfaceId)) {
      interfaceList.push(Interface);
      interfaceLookup[interfaceId] = Interface;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToImplementers: function (Class) {
    var implementers = this.__interfaces.upstream,
        implementerList = implementers.list,
        implementerLookup = implementers.lookup,
        classId = Class.__classId;

    if (!hOP.call(implementerLookup, classId)) {
      implementerList.push(Class);
      implementerLookup[classId] = Class;
    }
  },

  /**
   * @param {object} members
   * @private
   */
  _removeFromMissingMethods: function (members) {
    var missingMethodNames = this.__missingMethodNames.list,
        missingMethodLookup = this.__missingMethodNames.lookup;

    // removing methods from registry
    Object.getOwnPropertyNames(members)
    .filter(function (memberName) {
      return typeof members[memberName] === 'function';
    })
    // leaving only those already registered
    .filter(function (methodName) {
      return hOP.call(missingMethodLookup, methodName);
    })
    // de-registering method names
    .forEach(function (implementedMethodName) {
      missingMethodNames.splice(missingMethodNames.indexOf(implementedMethodName), 1);
      delete missingMethodLookup[implementedMethodName];
    });
  },

  /**
   * Adds functions in members to registry of missing methods names, unless
   * they're already implemented by the class, or any of the mixins.
   * @param {object} members
   * @private
   */
  _addToMissingMethods: function (members) {
    var contributions = this.__contributors.list,
        interfaces = this.__interfaces.downstream.list,
        missingMethodNames = this.__missingMethodNames.list,
        missingMethodLookup = this.__missingMethodNames.lookup;

    Object.getOwnPropertyNames(members)
    .filter(function (memberName) {
      return typeof members[memberName] === 'function';
    })
    // leaving out any methods already found in contributions
    .filter(function (methodName) {
      return !contributions.some(function (Class) {
        var method = Class.__members[methodName];
        return typeof method === 'function';
      });
    })
    // leaving out methods not found in any interfaces
    .filter(function (methodName) {
      return interfaces.some(function (Interface) {
        var method = Interface.__members[methodName];
        return typeof method === 'function';
      });
    })
    // leaving only those not yet registered
    .filter(function (missingMethodName) {
      return !hOP.call(missingMethodLookup, missingMethodName);
    })
    // registering method names as missing
    .forEach(function (missingMethodName) {
      missingMethodNames.push(missingMethodName);
      missingMethodLookup[missingMethodName] = true;
    });
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToDownstreamMixins: function (Class) {
    var mixins = this.__mixins.downstream,
        mixinList = mixins.list,
        mixinLookup = mixins.lookup,
        classId = Class.__classId;

    if (!hOP.call(mixinLookup, classId)) {
      // adding mixin and initial distance
      mixinList.push(Class);
      mixinLookup[classId] = 1;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToUpstreamMixins: function (Class) {
    var hosts = this.__mixins.upstream,
        hostList = hosts.list,
        hostLookup = hosts.lookup,
        classId = Class.__classId;

    if (!hOP.call(hostLookup, classId)) {
      // adding host and initial distance
      hostList.push(Class);
      hostLookup[classId] = 1;
    }
  },

  /**
   * @private
   */
  _addToBlenderIndex: function () {
    if (this.__mixins.downstream.list.length > 1) {
      $oop.BlenderIndex.addClass(this);
    }
  },

  /**
   * @private
   */
  _removeFromBlenderIndex: function () {
    $oop.BlenderIndex.removeClass(this);
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToBlenders: function (Class) {
    var blenders = this.__blenders,
        benderList = blenders.list,
        blenderLookup = blenders.lookup,
        classId = Class.__classId;

    if (!hOP.call(blenderLookup, classId)) {
      benderList.push(Class);
      blenderLookup[classId] = Class;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToDownstreamExpectations: function (Class) {
    var classId = this.__classId,
        expectedId = Class.__classId,
        mixinLookup = this.__mixins.downstream.lookup,
        expected = this.__expected.downstream,
        expectedList = expected.list,
        expectedLookup = expected.lookup;

    if (classId !== expectedId &&
        !hOP.call(mixinLookup, expectedId) &&
        !hOP.call(expectedLookup, expectedId)
    ) {
      // expected mixin is not mixed (which would cancel each other out)
      // adding to list of expected mixins
      expectedList.push(Class);
      expectedLookup[expectedId] = Class;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToUpstreamExpectations: function (Class) {
    var hosts = this.__expected.upstream,
        hostList = hosts.list,
        hostLookup = hosts.lookup,
        classId = Class.__classId;

    if (!hOP.call(hostLookup, classId)) {
      hostList.push(Class);
      hostLookup[classId] = Class;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _removeMetExpectations: function (Class) {
    var classId = Class.__classId,
        expected = this.__expected.downstream,
        expectedList = expected.list,
        expectedLookup = expected.lookup;

    if (hOP.call(expectedLookup, classId)) {
      expectedList.splice(expectedList.indexOf(classId), 1);
      delete expectedLookup[classId];
    }
  },

  /**
   * Extracts mixins (present & expected) from class and transfers them to the
   * current class as first-degree expectations.
   * @param {$oop.Class} Class
   * @private
   */
  _transferExpectedFrom: function (Class) {
    var that = this;

    // transferring mixins (present & expected) of class to current class as
    // expectations
    Class.__expected.downstream.list.concat(Class.__mixins.downstream.list)
    .forEach(function (Class) {
      that._addToDownstreamExpectations(Class);
      Class._addToUpstreamExpectations(that);
    });

    // transferring class AS expected to mixers and hosts of current class
    this.__mixins.upstream.list.concat(this.__expected.upstream.list)
    .forEach(function (Host) {
      Host._addToDownstreamExpectations(Class);
      Class._addToUpstreamExpectations(Host);
    });
  },

  /**
   * Transfers specified class as mixin to all blenders of the current class.
   * @param {$oop.Class} Class
   * @private
   */
  _transferMixinToBlenders: function (Class) {
    var that = this;
    this.__blenders.list
    .forEach(function (Blender) {
      Class._addToBlenders(Blender);
      Blender.mix(Class, that);
    });
  },

  /**
   * Transfers forward descriptors from specified class to current class.
   * @param {$oop.Class} Class
   * @private
   */
  _transferForwardsFrom: function (Class) {
    var that = this;

    Class.__forwards.list
    // excluding forward mixins that are already mixed by current class
    .filter(function (forward) {
      return !that.mixes(forward.mixin);
    })
    .forEach(function (forward) {
      that._addToForwards(forward.mixin, forward.filter, forward.source, that);
    });

    // removing forwards from current class that are mixed by Class
    this.__forwards.list
    .filter(function (forward) {
      return Class.mixes(forward.mixin);
    })
    .forEach(function (forward) {
      that._removeFromForwards(forward.mixin, forward.source);
    });
  },

  /**
   * Delegates a batch of methods to mixers.
   * @param {object} members
   * @private
   */
  _delegateToMixers: function (members) {
    var classId = this.__classId;

    this.__mixins.upstream.list
    .forEach(function (Class) {
      Class._addMethodsToMatrix(members, classId);
      Class._addPropertiesToMatrix(members, classId);
      Class._addPropertiesToClass(members);
      Class._addWrapperMethodsToClass(members);
      Class._removeFromMissingMethods(members);
    });
  },

  /**
   * Delegates a batch of methods to imeplementers.
   * (As possibly missing methods.)
   * @param {object} members
   * @private
   */
  _delegateToImplementers: function (members) {
    this.__interfaces.upstream.list
    .forEach(function (Class) {
      Class._addToMissingMethods(members);
    });
  },

  /**
   * Collects all contributors of specified class, traversing its entire
   * dependency tree.
   * @param {$oop.Class} Class
   * @returns {$oop.Class[]}
   * @private
   */
  _gatherAllContributorsFrom: function (Class) {
    var contributors = [],
        contributorLookup = {};

    (function getContributors(Class) {
      var classId = Class.__classId,
          contributorList = Class.__contributors.list,
          contributorCount = contributorList.length,
          i, contributor;

      // adding deeper inclusions' contributions first to maintain order of
      // method calls
      for (i = 0; i < contributorCount; i++) {
        contributor = contributorList[i];
        if (contributor !== Class) {
          getContributors(contributor);
        }
      }

      // all dependents' contributions have been added,
      // adding current class
      if (!contributorLookup[classId]) {
        contributors.push(Class);
        contributorLookup[classId] = Class;
      }
    }(Class));

    return contributors;
  },

  /**
   * Updates forwards lookup based on current contents of __forwards.list.
   * @private
   */
  _updateForwardLookup: function () {
    var forwards = this.__forwards;
    forwards.lookup = forwards.list
    .reduce(function (lookup, forward, i) {
      var lookupHash = [forward.mixin.__classId, forward.source.__classId]
      .map($oop.escapeCommas)
      .join(',');
      lookup[lookupHash] = i;
      return lookup;
    }, {});
  },

  /**
   * @param {$oop.Class} Mixin
   * @param {function} filter
   * @param {$oop.Class} Source
   * @param {$oop.Class} [AfterSource]
   * @private
   */
  _addToForwards: function (Mixin, filter, Source, AfterSource) {
    var forwards = this.__forwards,
        lookupHash = [Mixin.__classId, Source.__classId]
        .map($oop.escapeCommas)
        .join(','),
        // todo Maintain list indexes in lookup? (Like in __contributors)
        forwardLookup = forwards.lookup,
        forwardList = forwards.list,
        forwardSources = forwards.sources,
        forward,
        afterSourceIndex;

    if (!hOP.call(forwardLookup, lookupHash)) {
      forward = {
        mixin: Mixin,
        filter: filter,
        source: Source
      };

      if (AfterSource) {
        // inserting before a specific forward mixin
        afterSourceIndex = forwardSources.indexOf(AfterSource);

        if (afterSourceIndex > -1) {
          forwardList.splice(afterSourceIndex, 0, forward);
          forwardSources.splice(afterSourceIndex, 0, Source);
          this._updateForwardLookup();
        } else {
          // adding at end
          forwardLookup[lookupHash] = forwardList.length;
          forwardList.push(forward);
          forwardSources.push(Source);
        }
      } else {
        // adding at end
        forwardLookup[lookupHash] = forwardList.length;
        forwardList.push(forward);
        forwardSources.push(Source);
      }
    }
  },

  /**
   * @param {$oop.Class} Mixin
   * @param {$oop.Class} Source
   * @private
   */
  _removeFromForwards: function (Mixin, Source) {
    var forwards = this.__forwards,
        forwardHash = [Mixin.__classId, Source.__classId]
        .map($oop.escapeCommas)
        .join(','),
        forwardList = forwards.list,
        forwardSources = forwards.sources,
        forwardLookup = forwards.lookup,
        forwardIndex;

    if (hOP.call(forwardLookup, forwardHash)) {
      forwardIndex = forwardLookup[forwardHash];
      forwardList.splice(forwardIndex, 1);
      forwardSources.splice(forwardIndex, 1);
      this._updateForwardLookup();
    }
  },

  /**
   * @param {function} mapper
   * @private
   */
  _setInstanceMapper: function (mapper) {
    if (!this.__mapper) {
      // no mapper has been set yet
      this.__mapper = mapper;
    } else if (this.__mapper !== mapper) {
      // mapper already exists and is different than specified
      $assert.fail([
        "Instance mapper collision in '" + this.__classId + "'.",
        "Can't blend."
      ].join(" "));
    }
  },

  /**
   * Creates a new instance.
   * @param {Object} [properties]
   * @returns {$oop.Class}
   */
  create: function (properties) {
    properties = properties || {};

    // finding forward class (if any)
    var that = this,
        forwards,
        forwardCount,
        i, forward,
        mixins;
    while (true) {
      forwards = that.__forwards.list;
      forwardCount = forwards.length;
      mixins = [that];

      // obtaining suitable mixins
      for (i = 0; i < forwardCount; i++) {
        forward = forwards[i];
        if (forward.filter.call(this, properties)) {
          mixins.push(forward.mixin);
        }
      }

      if (mixins.length > 1) {
        // mixing new class
        that = $oop.blendClass(mixins);
      } else {
        // no matching forwards found
        // going with last value of that
        break;
      }
    }

    // fetching cached instance
    var mapper = that.__mapper,
        instances,
        instanceId, instance;
    if (mapper) {
      instances = that.__instanceLookup;
      instanceId = mapper.call(that, properties);
      instance = instances[instanceId];
      if (instance) {
        // instance found in cache
        return instance;
      }
    }

    // checking whether
    // ... methods match interfaces
    var missingMethodNames = this.__missingMethodNames.list;
    if (missingMethodNames.length) {
      $assert.fail([
        "Class '" + that.__classId + "' doesn't implement method(s): " +
        missingMethodNames
        .map($oop.addQuotes) + ".",
        "Can't instantiate."
      ].join(" "));
    }

    // ... all expected mixins are mixed
    var expected = that.__expected.downstream.list;
    if (expected.length) {
      // there are unmet expectations - can't instantiate
      $assert.fail([
        "Class '" + that.__classId + "' doesn't satisfy expectation(s): " +
        expected
        .map($oop.getClassId)
        .map($oop.addQuotes)
        .join(",") + ".",
        "Can't instantiate."
      ].join(" "));
    }

    // instantiating class
    instance = Object.create(that);

    // copying initial properties to instance
    var propertyNames,
        propertyCount,
        propertyName;
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
        "Invalid properties supplied to class '" + this.__classId + "'.",
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
   * Defines a batch of properties and methods contributed by the current class.
   * Can be called multiple times.
   * @param {object} batch
   * @returns {$oop.Class}
   */
  define: function (batch) {
    $assert.isObject(batch, "No members specified.");

    if (this.__contributors.lookup[this.__classId] === undefined) {
      // this is the first call to `define`
      // marking self as contributor
      this._addToContributors(this);

      // applying any members delegated so far
      this.define(this.__delegates);
    }

    // updating members in class
    this._addToMembers(batch);
    this._addMethodsToMatrix(batch, this.__classId);
    this._addPropertiesToMatrix(batch, this.__classId);
    this._addPropertiesToClass(batch);
    this._addWrapperMethodsToClass(batch);
    this._removeFromMissingMethods(batch);
    this._delegateToMixers(batch);
    this._delegateToImplementers(batch);

    return this;
  },

  /**
   * Delegates a batch of properties and methods to the current class.
   * Delegated members are like defined members, except they don't get applied
   * until the first batch of defines. When the class already has members
   * defined, `delegate` acts like exactly like `define`. Can be called
   * multiple times.
   * @param {object} batch
   * @returns {$oop.Class}
   */
  delegate: function (batch) {
    $assert.isObject(batch, "No members specified.");

    this._addToDelegates(batch);

    if (this.__contributors.lookup[this.__classId] !== undefined) {
      // when class already contributed
      // adding batch to members
      this.define(batch);
    }

    return this;
  },

  /**
   * Mixes specified mixin to the current class.
   * @param {$oop.Class} Mixin
   * @param {$oop.Class} [Through]
   * @returns {$oop.Class}
   * @todo Detect & throw on circular mixin
   */
  mix: function (Mixin, Through) {
    $assert.isClass(Mixin, "Class#mix expects type Class.");

    var members = Mixin.__members;

    // updating class relationships
    this._removeFromBlenderIndex();
    this._addToDownstreamMixins(Mixin);
    Mixin._addToUpstreamMixins(this);
    this._addToBlenderIndex();
    this._updateMemberMatrix(this.__methodMatrix, Mixin, Through);
    this._updateMemberMatrix(this.__propertyMatrix, Mixin, Through);
    this._addToContributors(Mixin, Through);
    this._removeMetExpectations(Mixin);
    this._transferExpectedFrom(Mixin);
    this._transferMixinToBlenders(Mixin);
    this._transferForwardsFrom(Mixin);

    // updating members in class
    this._addMethodsToMatrix(members, Mixin.__classId, Through && Through.__classId);
    this._addPropertiesToMatrix(members, Mixin.__classId, Through && Through.__classId);
    this._addPropertiesToClass(members);
    this._addWrapperMethodsToClass(members);
    this._removeFromMissingMethods(members);

    if (Mixin.__mapper) {
      this._setInstanceMapper(Mixin.__mapper);
    }

    return this;
  },

  /**
   * Mixes specified mixin to the current class given that the specified
   * callback returns truthy.
   * @param {$oop.Class} Mixin
   * @param {function} callback
   * @returns {$oop.Class}
   */
  mixWhen: function (Mixin, callback) {
    if (callback.call(this)) {
      this.mix(Mixin);
    }
    return this;
  },

  /**
   * Mixes specified class and all its mixins, direct or indirect, to the
   * current class.
   * @param {$oop.Class} Class
   * @returns {$oop.Class}
   */
  blend: function (Class) {
    // gathering all dependencies (including Class)
    var that = this,
        contributors = this._gatherAllContributorsFrom(Class);

    // mixing all dependencies
    contributors
    .forEach(function (Class) {
      Class._addToBlenders(that);
      that.mix(Class);
    });

    return this;
  },

  /**
   * Mixes specified class and all its mixins, direct or indirect, to the
   * current class, given that the specified callback returns truthy.
   * @param {$oop.Class} Class
   * @param {function} callback
   * @returns {$oop.Class}
   */
  blendWhen: function (Class, callback) {
    if (callback.call(this)) {
      this.blend(Class);
    }
    return this;
  },

  /**
   * Specifies an interface to be implemented by the host class.
   * @param {$oop.Class} Interface
   * @returns {$oop.Class}
   */
  implement: function (Interface) {
    $assert.isClass(Interface, "Class#implement expects type Class.");

    this._addToInterfaces(Interface);
    Interface._addToImplementers(this);
    this._addToMissingMethods(Interface.__members);

    return this;
  },

  /**
   * Specifies that a mixin is expected by to be (on) the host class.
   * Used by mixins only.
   * @param {$oop.Class} Class
   * @returns {$oop.Class}
   */
  expect: function (Class) {
    $assert.isClass(Class, "Class#expect expects type Class.");

    this._addToDownstreamExpectations(Class);
    Class._addToUpstreamExpectations(this);
    this._transferExpectedFrom(Class);

    return this;
  },

  /**
   * @param {$oop.Class} Mixin
   * @param {function} filter
   * @returns {$oop.Class}
   */
  forwardBlend: function (Mixin, filter) {
    $assert.isClass(Mixin, "Class#forwardBlend expects type Class.");

    var Source = this;

    this._addToForwards(Mixin, filter, Source);

    // delegating forward to mixers
    this.__mixins.upstream.list
    .filter(function (Mixer) {
      return !Mixer.mixes(Mixin);
    })
    .forEach(function (Mixer) {
      Mixer._addToForwards(Mixin, filter, Source);
    });

    return this;
  },

  /**
   * Specifies a mapper function to be used to build a registry.
   * @todo Rename
   * @param {function} mapper
   * @returns {$oop.Class}
   */
  cache: function (mapper) {
    $assert.isFunction(mapper, "Class#cache expects function argument.");

    this._setInstanceMapper(mapper);

    // delegating mapper to mixers
    this.__mixins.upstream.list
    .forEach(function (Class) {
      Class._setInstanceMapper(mapper);
    });

    return this;
  },

  /**
   * Tells whether current class implements the specified interface.
   * @param {$oop.Class} Interface
   * @returns {boolean}
   */
  implements: function (Interface) {
    $assert.isClass(Interface, "Class type expected");
    return !!this.__interfaces.downstream.lookup[Interface.__classId];
  },

  /**

   * Tells whether the specified class implements the current Interface.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  implementedBy: function (Class) {
    return $oop.Class.isPrototypeOf(Class) &&
        Class.implements(this);
  },

  /**
   * Tells whether current class is or mixes the specified class.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  mixes: function (Class) {
    $assert.isClass(Class, "Class type expected");

    var classId = Class.__classId;
    return this.__classId === classId ||
        !!this.__mixins.downstream.lookup[classId];
  },

  /**
   * Tells whether the specified class mixes the current class.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  mixedBy: function (Class) {
    return $oop.Class.isPrototypeOf(Class) &&
        Class.mixes(this);
  },

  /**
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  expects: function (Class) {
    $assert.isClass(Class, "Class type expected");
    return !!this.__expected.downstream.lookup[Class.__classId];
  },

  /**
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  expectedBy: function (Class) {
    return $oop.Class.isPrototypeOf(Class) &&
        Class.expects(this);
  },

  /**
   * Binds and stores the specified methods on the instance, so they're
   * reusable as callbacks.
   * @param {...string} methodName
   * @returns {$oop.Class}
   */
  elevateMethods: function (methodName) {
    var classId = this.__classId,
        Class = $oop.getClass(classId),
        argumentCount = arguments.length,
        i, method;

    for (i = 0; i < argumentCount; i++) {
      methodName = arguments[i];
      method = Class[methodName];
      if (typeof method !== 'function') {
        $assert.fail([
          "Method '" + classId + '#' + methodName + "' not a function.",
          "Can't elevate."
        ].join(" "));
      } else {
        this[methodName] = method.bind(this);
      }
    }

    return this;
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$oop.Class} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isClass: function (expr, message) {
    return $assert.assert(
        $oop.Class.isPrototypeOf(expr), message);
  },

  /**
   * @param {$oop.Class} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isClassOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $oop.Class.isPrototypeOf(expr), message);
  }
});
