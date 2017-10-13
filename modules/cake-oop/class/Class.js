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
   * Copies batch of members to class members container.
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
   * Adds members to the specified member lookup, indexed by method name, then
   * order.
   * @param {$oop.MemberMatrix} memberMatrix
   * @param {object} members Contributed members (may contain properties)
   * @param {string} classId ID of contributing class
   * @param {string} [nextId] ID of class the contributor is inserted before
   * @private
   */
  _addToMemberMatrix: function (memberMatrix, members, classId, nextId) {
    var contributorLookup = this.__contributors.lookup,
        classIndex = contributorLookup[classId],
        nextIndex = contributorLookup[nextId];

    if (nextId !== undefined) {
      // through class is defined
      // making room for incoming methods
      Object.getOwnPropertyNames(memberMatrix)
      // we don't need to splice where there are no methods beyond nextIndex
      .filter(function (methodName) {
        var methods = memberMatrix[methodName];
        return methods && methods.length >= nextIndex;
      })
      // making room for contributor
      .forEach(function (methodName) {
        var methods = memberMatrix[methodName];
        methods.splice(nextIndex - 1, 0, undefined);
      });
    }

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
   * @param {string} [nextId] ID of class the contributor is inserted before
   * @private
   */
  _addMethodsToMatrix: function (members, classId, nextId) {
    // todo Break out method extractor?
    var methods = Object.getOwnPropertyNames(members)
    .filter(function (memberName) {
      return typeof members[memberName] === 'function';
    })
    .reduce(function (result, methodName) {
      result[methodName] = members[methodName];
      return result;
    }, {});

    this._addToMemberMatrix(this.__methodMatrix, methods, classId, nextId);
  },

  /**
   * Adds methods to method lookup, indexed by method name, then order.
   * @param {object} members Contributed members (may contain properties)
   * @param {string} classId ID of contributing class
   * @param {string} [nextId] ID of class the contributor is inserted before
   * @private
   */
  _addPropertiesToMatrix: function (members, classId, nextId) {
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

    this._addToMemberMatrix(this.__propertyMatrix, properties, classId, nextId);
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
          saved = {};

      // decorating each contributed method with a `saved` container
      compactedMethods.forEach(function (method) {
        method.saved = saved;
      });

      if (methodCount === 1) {
        // there is only 1 function so far for this method
        that[methodName] = compactedMethods[0];
      } else if (methodCount > 1) {
        // there are more than 1 functions for this method in the matrix
        that[methodName] = function wrapper() {
          var i, method, result;

          // calling function in order of contributions
          for (i = 0; i < methodCount; i++) {
            method = compactedMethods[i];
            method.returned = result;
            result = method.apply(this, arguments);
          }

          return result;
        };
      }
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
  _addToMixins: function (Class) {
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
  _addToMixers: function (Class) {
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
  _addToMixerIndex: function () {
    if (this.__mixins.downstream.list.length > 1) {
      $oop.MixerIndex.setClass(this);
    }
  },

  /**
   * Updates class distances based on the inclusion of the specified class.
   * Inclusion distance determines forwards priority.
   * @private
   * @deprecated Remove alongside with #forwardTo()
   */
  _updateClassDistances: function (Mixin) {
    var classId = this.__classId,
        mixinId = Mixin.__classId,
        mixinLookup = this.__mixins.downstream.lookup;

    // updating distance of parent paths hosts of 2nd degree mixins
    var mixinHosts2deg = Mixin.__mixins.upstream,
        mixinHosts2degLookup = mixinHosts2deg.lookup;
    mixinHosts2deg.lookup[classId] = mixinLookup[mixinId] =
        mixinHosts2deg.list
        .filter(function (MixinHost) {
          return hOP.call(mixinLookup, MixinHost.__classId);
        })
        .reduce(function (distance, MixinHost) {
          return Math.max(distance,
              mixinLookup[MixinHost.__classId] +
              MixinHost.__mixins.downstream.lookup[mixinId]);
        }, mixinLookup[mixinId]);

    // updating distances of child paths with lead 2nd degree mixins & lookup
    var mixins2deg = Mixin.__mixins.downstream,
        mixins2degLookup = mixins2deg.lookup;
    mixins2deg.list
    .filter(function (Mixin2deg) {
      return hOP.call(mixinLookup, Mixin2deg.__classId);
    })
    .forEach(function (Mixin2deg) {
      var mixin2degId = Mixin2deg.__classId,
          mixinHost3degLookup = Mixin2deg.__mixins.upstream.lookup;
      mixinHost3degLookup[classId] = mixinLookup[mixin2degId] =
          Math.max(mixinLookup[mixin2degId],
              mixinLookup[mixinId] +
              mixins2degLookup[mixin2degId]);
    });

    // updating distances of child paths with trail
    var hosts = this.__mixins.upstream;
    hosts.list
    .filter(function (Host) {
      return hOP.call(Host.__mixins.downstream.lookup, mixinId);
    })
    .forEach(function (Host) {
      var hostId = Host.__classId,
          hostMixinLookup = Host.__mixins.downstream.lookup;
      mixinHosts2degLookup[hostId] = hostMixinLookup[mixinId] =
          Math.max(hostMixinLookup[mixinId],
              mixinLookup[mixinId] +
              hostMixinLookup[classId]);
    });
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToTransitiveMixers: function (Class) {
    var transitiveMixers = this.__transitiveMixers,
        transitiveMixerList = transitiveMixers.list,
        transitiveMixerLookup = transitiveMixers.lookup,
        classId = Class.__classId;

    if (!hOP.call(transitiveMixerLookup, classId)) {
      transitiveMixerList.push(Class);
      transitiveMixerLookup[classId] = Class;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToExpected: function (Class) {
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
  _addToHosts: function (Class) {
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
  _removeFromExpected: function (Class) {
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
      // adding expected mixin to registry
      that._addToExpected(Class);

      // adding to hosts on expected
      Class._addToHosts(that);
    });

    // transferring class AS expected to mixers and hosts of current class
    this.__mixins.upstream.list.concat(this.__expected.upstream.list)
    .forEach(function (Host) {
      // adding expected mixin to registry
      Host._addToExpected(Class);

      // adding to hosts on expected mixin
      Class._addToHosts(Host);
    });
  },

  /**
   * Transfers specified class as mixin to all transitive mixers of the current
   * class.
   * @param {$oop.Class} Class
   * @private
   */
  _transferMixinToTransitiveMixers: function (Class) {
    var that = this;
    this.__transitiveMixers.list.forEach(function (TransitiveMixer) {
      // adding mixer to mixin
      Class._addToTransitiveMixers(TransitiveMixer);

      // mixing class in mixer
      TransitiveMixer.mixOnly(Class, that);
    });
  },

  /**
   * Transfers forward descriptors from specified class to current class.
   * @param {$oop.Class} Class
   * @private
   */
  _transferForwardsFrom: function (Class) {
    var that = this,
        forwards = Class.__forwards2,
        forwardFilters = forwards.filters,
        forwardSources = forwards.sources;

    forwards.mixins
    .forEach(function (Mixin, i) {
      if (!that.mixes(Mixin)) {
        // excluding forward mixins that are already mixed by current class
        that._addToForwards(Mixin, forwardFilters[i], forwardSources[i]);
      }
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
      // adding methods to lookup at specified index
      Class._addMethodsToMatrix(members, classId);

      // adding properties to lookup at specified index
      Class._addPropertiesToMatrix(members, classId);

      // adding / overwriting properties
      Class._addPropertiesToClass(members);

      // adding wrapper method when necessary
      Class._addWrapperMethodsToClass(members);

      // updating missing method names
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
      // updating missing method names
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
   * Rebuilds forwards array based on class distances and forwards contents.
   * @private
   * @deprecated Remove when #forwardMix is ready
   */
  _updateForwards: function () {
    var forwards = this.__forwards,
        hostDistances = this.__mixins.upstream.lookup;

    // sorting forwards by priority (descending)
    // here we're relying on Array#sort() mutating the array as the same array
    // is referenced from the final class
    forwards.sort(function (/**$oop.ForwardDescriptor*/a,
        /**$oop.ForwardDescriptor*/b
    ) {
      var aId = a.class.__classId,
          bId = b.class.__classId,
          ap = hostDistances[aId] || 0,
          bp = hostDistances[bId] || 0;
      return ap > bp ? -1 : bp > ap ? 1 : 0;
    });
  },

  /**
   * @param {$oop.Class} Mixin
   * @param {function} filter
   * @param {$oop.Class} Source
   * @private
   */
  _addToForwards: function (Mixin, filter, Source) {
    var forwards = this.__forwards2,
        lookupHash = [Mixin.__classId, Source.__classId]
        .map($oop.escapeCommas)
        .join(','),
        forwardLookup = forwards.lookup,
        forwardMixins = forwards.mixins,
        forwardFilters = forwards.filters,
        forwardSources = forwards.sources;

    if (!hOP.call(forwardLookup, lookupHash)) {
      // mixin has not been added yet
      // todo Replace w/ splice once we pass Through class
      forwardMixins.push(Mixin);
      forwardFilters.push(filter);
      forwardSources.push(Source);
      forwardLookup[lookupHash] = true;
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
        "Can't mix."
      ].join(" "));
    }
  },

  /**
   * Creates a new instance.
   * @param {Object} [properties]
   * @returns {$oop.Class}
   */
  create: function (properties) {
    // retrieving forward class (if any)
    // todo Remove when #forwardMix is done
    var that = this,
        forwards = this.__forwards,
        forwardsCount = forwards.length,
        i, forward;
    for (i = 0; i < forwardsCount; i++) {
      forward = forwards[i];
      if (forward.filter(properties)) {
        // properties fit forward filter
        // forwarding
        that = forward['class'];
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

    var propertyNames,
        propertyCount,
        propertyName;

    if (properties instanceof Object) {
      // copying properties to instance
      propertyNames = Object.getOwnPropertyNames(properties);
      propertyCount = propertyNames.length;
      for (i = 0; i < propertyCount; i++) {
        propertyName = propertyNames[i];
        instance[propertyName] = properties[propertyName];
      }
    } else if (properties !== undefined) {
      // invalid properties supplied
      $assert.fail([
        "Invalid properties supplied to class '" + this.__classId + "'.",
        "Can't instantiate."
      ].join(" "));
    }

    // spreading properties
    if (typeof instance.spread === 'function') {
      instance.spread();
    }

    // initializing instance
    if (typeof instance.init === 'function') {
      instance.init();
    }

    // caching instance (if necessary)
    if (instanceId !== undefined) {
      instances[instanceId] = instance;
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

    // adding batch to members, overwriting conflicting properties
    this._addToMembers(batch);

    // adding methods to lookup at specified index
    this._addMethodsToMatrix(batch, this.__classId);

    // adding properties to lookup at specified index
    this._addPropertiesToMatrix(batch, this.__classId);

    // adding / overwriting properties
    this._addPropertiesToClass(batch);

    // adding wrapper method when necessary
    this._addWrapperMethodsToClass(batch);

    // updating missing methods names
    this._removeFromMissingMethods(batch);

    // delegating batch to mixers
    this._delegateToMixers(batch);

    // updating implementers
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

    // adding batch of delegates, overwriting conflicting properties
    this._addToDelegates(batch);

    if (this.__contributors.lookup[this.__classId] !== undefined) {
      // when class already contributed
      // adding batch to members
      this.define(batch);
    }

    return this;
  },

  /**
   * Specifies a class to be mixed by the host class.
   * @param {$oop.Class} Class
   * @param {$oop.Class} [Through]
   * @returns {$oop.Class}
   */
  mixOnly: function (Class, Through) {
    $assert.isClass(Class, "Class#mixOnly expects type Class.");

    // todo Detect & throw on circular mixin

    // adding to downstream mixins
    this._addToMixins(Class);

    // adding to upstream mixins
    Class._addToMixers(this);

    // adding self to MixerIndex
    this._addToMixerIndex();

    // determining how mixin affects distances
    this._updateClassDistances(Class);

    // rebuilding forwards information
    this._updateForwards();

    // adding mixed class to contributions
    this._addToContributors(Class, Through);

    // removing met expectations
    this._removeFromExpected(Class);

    // transferring 2nd dregree mixins (present & expected) from mixin
    this._transferExpectedFrom(Class);

    // transferring as mixin to transitive mixers
    this._transferMixinToTransitiveMixers(Class);

    // transferring forward definitions
    this._transferForwardsFrom(Class);

    var members = Class.__members;

    // adding methods to lookup at specified index
    this._addMethodsToMatrix(members, Class.__classId, Through && Through.__classId);

    // adding properties to lookup at specified index
    this._addPropertiesToMatrix(members, Class.__classId, Through && Through.__classId);

    // adding / overwriting properties
    this._addPropertiesToClass(members);

    // adding wrapper method when necessary
    this._addWrapperMethodsToClass(members);

    // updating missing method names
    this._removeFromMissingMethods(members);

    // updating instance mapper
    if (Class.__mapper) {
      this._setInstanceMapper(Class.__mapper);
    }

    return this;
  },

  /**
   * Mixes specified class and all its mixins, direct or indirect.
   * @param {$oop.Class} Class
   * @returns {$oop.Class}
   */
  mix: function (Class) {
    // gathering all dependencies (including Class)
    var that = this,
        contributors = this._gatherAllContributorsFrom(Class);

    // mixing all dependencies
    contributors.forEach(function (Class) {
      // adding current class to mixin as transitive mixer
      Class._addToTransitiveMixers(that);

      that.mixOnly(Class);
    });

    return this;
  },

  /**
   * Specifies an interface to be implemented by the host class.
   * @param {$oop.Class} Interface
   * @returns {$oop.Class}
   */
  implement: function (Interface) {
    $assert.isClass(Interface, "Class#implement expects type Class.");

    // adding to interfaces
    this._addToInterfaces(Interface);

    // adding to implementers on Interface
    Interface._addToImplementers(this);

    // updating missing method names
    this._addToMissingMethods(Interface.__members);

    return this;
  },

  /**
   * Specifies that a mixin is expected by to be (on) the host class.
   * Used by traits only.
   * @param {$oop.Class} Class
   * @returns {$oop.Class}
   */
  expect: function (Class) {
    $assert.isClass(Class, "Class#expect expects type Class.");

    // adding expected mixin to registry
    this._addToExpected(Class);

    // adding to hosts on expected
    Class._addToHosts(this);

    // transferring mixins (present & expected) from expected mixin
    this._transferExpectedFrom(Class);

    return this;
  },

  /**
   * Forwards the class to the specified class, if constructor arguments
   * satisfy the supplied filter.
   * @param {$oop.Class} Class
   * @param {function} filter
   * @returns {$oop.Class}
   * @deprecated Use #forwardMix instead.
   */
  forwardTo: function (Class, filter) {
    $assert.isClass(Class, "Class#forwardTo expects type Class.");

    var forwards = this.__forwards;

    // adding forward descriptor
    forwards.push({
      'class': Class,
      'filter': filter
    });

    // re-building forwards order
    this._updateForwards();

    return this;
  },

  /**
   * @param {$oop.Class} Mixin
   * @param {function} filter
   * @returns {$oop.Class}
   */
  forwardMix: function (Mixin, filter) {
    $assert.isClass(Mixin, "Class#forwardMix expects type Class.");

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
