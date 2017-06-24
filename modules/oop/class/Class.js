"use strict";

/**
 * Composable class.
 * @class $oop.Class
 */
$oop.Class = $oop.createObject(Object.prototype, /** @lends $oop.Class# */{
  /**
   * All classes indexed by class ID.
   * @memberOf $oop.Class
   * @type {object}
   */
  classLookup: {},

  /**
   * Fetches the class by the specified ID. Creates the class if it doesn't
   * exist yet.
   * @memberOf $oop.Class
   * @param {string} classId
   * @returns {$oop.Class}
   */
  getClass: function (classId) {
    $assert.isString(classId, "No class ID was specified.");

    var classes = this.classLookup,
      Class = classes[classId];

    if (!Class) {
      // class is not initialized yet
      Class = $oop.createObject($oop.Class, /** @lends $oop.Class# */{
        /**
         * Identifies class.
         * @type {string}
         * @private
         */
        __classId: classId,

        /**
         * Properties and methods contributed by the current class.
         * @type {object}
         * @private
         */
        __members: {},

        /**
         * Properties and methods delegated to the current class.
         * @type {object}
         * @private
         */
        __delegates: {},

        /**
         * Registry of interfaces implemented by the current class, and classes
         * implementing the current class as an interface.
         * @todo Add typedef
         * @type {object}
         * @private
         */
        __interfaces: {
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        },

        /**
         * Registry of classes included by the current class, and classes that
         * include the current class.
         * @todo Add typedef
         * @type {object}
         * @private
         */
        __includes: {
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        },

        /**
         * Registry of classes required by the current class, and classes
         * requiring the current class.
         * @todo Add typedef
         * @type {object}
         * @private
         */
        __requires: {
          downstream: {list: [], lookup: {}},
          upstream: {list: [], lookup: {}}
        },

        /**
         * Registry of classes that extend the current class.
         * @type {{list: Array, lookup: object}}
         * @private
         */
        __extenders: {list: [], lookup: {}},

        /**
         * Registry of methods not implemented by current class.
         * @type {{list: Array, lookup: object}}
         * @private
         */
        __missingMethodNames: {list: [], lookup: {}},

        /**
         * Registry of all classes contributing members to the current class.
         * **Order is important.**
         * @type {{list: Array, lookup: object}}
         * @private
         */
        __contributors: {list: [], lookup: {}},

        /**
         * Two dimensional lookup of methods contributed to the class. Indexed
         * by method name, then contributor index. (Index of contributor in
         * `__contributors.list`.)
         * **Order is important.**
         * @type {object}
         * @private
         */
        __methodMatrix: {},

        /**
         * List of forwards (surrogate) descriptors.
         * @type {$oop.ForwardDescriptor[]}
         * @private
         */
        __forwards: [],

        /**
         * Hash function for caching instances.
         * @todo Rename
         * @type {function}
         * @private
         */
        __mapper: undefined,

        /**
         * Lookup of cached instances indexed by hash.
         * @type {object}
         * @private
         */
        __instanceLookup: {}
      }, {
        writable: true,
        enumerable: false,
        configurable: true
      });

      // adding class to registry
      classes[classId] = Class;
    }

    return Class;
  },

  /**
   * Copies batch of members to class members container.
   * @param {object} batch
   * @private
   */
  _addToMembers: function (batch) {
    var members = this.__members;

    Object.getOwnPropertyNames(batch)
      .forEach(function (memberName) {
        // todo Throw on conflict
        members[memberName] = batch[memberName];
        return members;
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
        delegates[memberName] = batch[memberName];
        return delegates;
      });
  },

  /**
   * Adds class to list of contributors.
   * @param {$oop.Class} Class Contributing class
   * @param {$oop.Class} [Next] Class before which the contributing class
   *   should be placed.
   * @private
   */
  _addToContributors: function (Class, Next) {
    var contributors = this.__contributors,
      contributorList = contributors.list,
      contributorLookup = contributors.lookup,
      classId = Class.__classId;

    if (!hOP.call(contributorLookup, classId)) {
      if (Next) {
        // placing include before Next class, and reconstructing lookup
        contributorList.splice(contributorList.indexOf(Next), 0, Class);
        contributors.lookup = contributorList.reduce(function (lookup, Class, i) {
          lookup[Class.__classId] = i;
          return lookup;
        }, {});
      } else {
        // adding include
        contributorLookup[classId] = contributorList.length;
        contributorList.push(Class);
      }
    }
  },

  /**
   * Adds methods to method lookup, indexed by method name, then order.
   * @param {object} members Contributed members (may contain properties)
   * @param {string} classId ID of contributing class
   * @param {string} [nextId] ID of class the contributor is inserted before
   * @private
   */
  _addMethodsToMatrix: function (members, classId, nextId) {
    var methodMatrix = this.__methodMatrix,
      contributorLookup = this.__contributors.lookup,
      classIndex = contributorLookup[classId],
      nextIndex = contributorLookup[nextId];

    if (nextId !== undefined) {
      // through class is defined
      // making room for incoming methods
      Object.getOwnPropertyNames(methodMatrix)
        // we don't need to splice where there are no methods beyond nextIndex
        .filter(function (methodName) {
          var methods = methodMatrix[methodName];
          return methods && methods.length >= nextIndex;
        })
        // making room for contributor
        .forEach(function (methodName) {
          var methods = methodMatrix[methodName];
          methods.splice(nextIndex - 1, 0, undefined);
        });
    }

    // just setting members in method matrix
    Object.getOwnPropertyNames(members)
      .filter(function (memberName) {
        return typeof members[memberName] === 'function';
      })
      .forEach(function (methodName) {
        var methods;
        if (hOP.call(methodMatrix, methodName)) {
          methods = methodMatrix[methodName];
        } else {
          methods = methodMatrix[methodName] = [];
        }
        methods[classIndex] = members[methodName];
      });
  },

  /**
   * Adds properties to class.
   * @param {object} members
   * @private
   */
  _addPropertiesToClass: function (members) {
    var Class = $oop.Class,
      that = this;

    Object.getOwnPropertyNames(members)
      .filter(function (memberName) {
        return typeof members[memberName] !== 'function';
      })
      .forEach(function (propertyName) {
        var propertyValue = members[propertyName];

        if (Class.isPrototypeOf(propertyValue) &&
          Object.getPrototypeOf(propertyValue) !== Class
        ) {
          $assert.assert(false, [
            "Instance not allowed as static property value for '" + that.__classId + "." + propertyName + "'.",
            "Can't build."
          ].join(" "));
        }

        that[propertyName] = propertyValue;
      });
  },

  /**
   * Adds wrapper methods for functions contributed to the class. Wrapper
   * methods cycle through versions of the same method, and call them in the
   * order of contributions. For performance reasons, wrapper methods return
   * the result of the last call. It's the responsibility of each contributed
   * method to ensure access to its individual return value, if needed.
   * @todo Add original method when there's only 1 contribution.
   * @param {object} members
   * @private
   */
  _addWrapperMethodsToClass: function (members) {
    var that = this;

    Object.getOwnPropertyNames(members)
      .filter(function (memberName) {
        return typeof members[memberName] === 'function';
      })
      .filter(function (methodName) {
        return !hOP.call(that, methodName);
      })
      .forEach(function (methodName) {
        var methodMatrix = that.__methodMatrix;

        // todo Test
        that[methodName] = function () {
          var methods = methodMatrix[methodName],
            methodCount = methods.length,
            i, method, result;

          // calling function in order of contributions
          for (i = 0; i < methodCount; i++) {
            method = methods[i];
            if (method) {
              method.returned = result;
              result = method.apply(this, arguments);
            }
          }

          return result;
        };
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
      // unregistering method names
      .forEach(function (implementedMethodName) {
        missingMethodNames.splice(missingMethodNames.indexOf(implementedMethodName), 1);
        delete missingMethodLookup[implementedMethodName];
      });
  },

  /**
   * Adds functions in members to registry of missing methods names, unless
   * they're already implemented by the class, or any of the includes.
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
  _addToIncludes: function (Class) {
    var includes = this.__includes.downstream,
      includeList = includes.list,
      includeLookup = includes.lookup,
      classId = Class.__classId;

    if (!hOP.call(includeLookup, classId)) {
      // adding include and initial distance
      includeList.push(Class);
      includeLookup[classId] = 1;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToIncluders: function (Class) {
    var hosts = this.__includes.upstream,
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
   * Updates class distances based on the inclusion of the specified class.
   * Inclusion distance determines forwards priority.
   * @private
   */
  _updateClassDistances: function (Include) {
    var classId = this.__classId,
      includeId = Include.__classId,
      includeLookup = this.__includes.downstream.lookup;

    // updating distance of parent paths hosts of 2nd degree includes
    var includeHosts2deg = Include.__includes.upstream,
      includeHosts2degLookup = includeHosts2deg.lookup;
    includeHosts2deg.lookup[classId] = includeLookup[includeId] =
      includeHosts2deg.list
        .filter(function (IncludeHost) {
          return hOP.call(includeLookup, IncludeHost.__classId);
        })
        .reduce(function (distance, IncludeHost) {
          return Math.max(distance,
            includeLookup[IncludeHost.__classId] +
            IncludeHost.__includes.downstream.lookup[includeId]);
        }, includeLookup[includeId]);

    // updating distances of child paths with lead 2nd degree includes & lookup
    var includes2deg = Include.__includes.downstream,
      includes2degLookup = includes2deg.lookup;
    includes2deg.list
      .filter(function (Include2deg) {
        return hOP.call(includeLookup, Include2deg.__classId);
      })
      .forEach(function (Include2deg) {
        var include2degId = Include2deg.__classId,
          includeHost3degLookup = Include2deg.__includes.upstream.lookup;
        includeHost3degLookup[classId] = includeLookup[include2degId] =
          Math.max(includeLookup[include2degId],
            includeLookup[includeId] +
            includes2degLookup[include2degId]);
      });

    // updating distances of child paths with trail
    var hosts = this.__includes.upstream;
    hosts.list
      .filter(function (Host) {
        return hOP.call(Host.__includes.downstream.lookup, includeId);
      })
      .forEach(function (Host) {
        var hostId = Host.__classId,
          hostIncludeLookup = Host.__includes.downstream.lookup;
        includeHosts2degLookup[hostId] = hostIncludeLookup[includeId] =
          Math.max(hostIncludeLookup[includeId],
            includeLookup[includeId] +
            hostIncludeLookup[classId]);
      });
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToExtenders: function (Class) {
    var extenders = this.__extenders,
      extenderList = extenders.list,
      extenderLookup = extenders.lookup,
      classId = Class.__classId;

    if (!hOP.call(extenderLookup, classId)) {
      extenderList.push(Class);
      extenderLookup[classId] = Class;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToRequires: function (Class) {
    var classId = this.__classId,
      requireId = Class.__classId,
      includeLookup = this.__includes.downstream.lookup,
      requires = this.__requires.downstream,
      requireList = requires.list,
      requireLookup = requires.lookup;

    if (classId !== requireId &&
      !hOP.call(includeLookup, requireId) &&
      !hOP.call(requireLookup, requireId)
    ) {
      // require is not included (which would cancel each other out)
      // adding to requires
      requireList.push(Class);
      requireLookup[requireId] = Class;
    }
  },

  /**
   * @param {$oop.Class} Class
   * @private
   */
  _addToHosts: function (Class) {
    var hosts = this.__requires.upstream,
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
  _removeFromRequires: function (Class) {
    var classId = Class.__classId,
      requires = this.__requires.downstream,
      requireList = requires.list,
      requireLookup = requires.lookup;

    if (hOP.call(requireLookup, classId)) {
      requireList.splice(requireList.indexOf(classId), 1);
      delete requireLookup[classId];
    }
  },

  /**
   * Extracts includes and requires from class and transfers them to the
   * current class as first-degree requires.
   * @param {$oop.Class} Class
   * @private
   */
  _transferRequiresFrom: function (Class) {
    var that = this;

    // transferring requires & includes of class to current class as requires
    Class.__requires.downstream.list.concat(Class.__includes.downstream.list)
      .forEach(function (Class) {
        // adding require to registry
        that._addToRequires(Class);

        // adding to hosts on require
        Class._addToHosts(that);
      });

    // transferring class AS require to includers and hosts of current class
    this.__includes.upstream.list.concat(this.__requires.upstream.list)
      .forEach(function (Host) {
        // adding require to registry
        Host._addToRequires(Class);

        // adding to hosts on require
        Class._addToHosts(Host);
      });
  },

  /**
   * Transfers specified class as include to all extenders of the current class.
   * @param {$oop.Class} Class
   * @private
   */
  _transferIncludeToExtenders: function (Class) {
    var that = this;
    this.__extenders.list.forEach(function (Extender) {
      // adding extender to include
      Class._addToExtenders(Extender);

      // including class in extender
      Extender.include(Class, that);
    });
  },

  /**
   * Delegates a batch of methods to includers.
   * @param {object} members
   * @private
   */
  _delegateToIncluders: function (members) {
    var classId = this.__classId;

    this.__includes.upstream.list
      .forEach(function (Class) {
        // adding methods to lookup at specified index
        Class._addMethodsToMatrix(members, classId);

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
   */
  _updateForwards: function () {
    var forwards = this.__forwards,
      hostDistances = this.__includes.upstream.lookup;

    // sorting forwards by priority (descending)
    // here we're relying on Array#sort() mutating the array as the same array
    // is referenced from the final class
    forwards.sort(function (/**$oop.ForwardDescriptor*/a, /**$oop.ForwardDescriptor*/b) {
      var aId = a.class.__classId,
        bId = b.class.__classId,
        ap = hostDistances[aId] || 0,
        bp = hostDistances[bId] || 0;
      return ap > bp ? -1 : bp > ap ? 1 : 0;
    });
  },

  /**
   * Creates a new instance.
   * @returns {$oop.Class}
   */
  create: function () {
    // retrieving forward class (if any)
    var that = this,
      forwards = this.__forwards,
      forwardsCount = forwards.length,
      i, forward;
    for (i = 0; i < forwardsCount; i++) {
      forward = forwards[i];
      if (forward.filter.apply(this, arguments)) {
        // ctr arguments fit forward filter
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
      instanceId = mapper.apply(this, arguments);
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
      $assert.assert(false, [
        "Class '" + that.__classId + "' doesn't implement method(s): " +
        missingMethodNames
          .map(function (methodName) {
            return "'" + methodName + "'";
          }) + ".",
        "Can't instantiate."
      ].join(" "));
    }

    // ... all requires are included
    var requires = that.__requires.downstream.list;
    if (requires.length) {
      // there are unfulfilled requires - can't instantiate
      $assert.assert(false, [
        "Class '" + that.__classId + "' doesn't satisfy require(s): " +
        requires
          .map(function (Class) {
            return "'" + Class.__classId + "'";
          })
          .join(",") + ".",
        "Can't instantiate."
      ].join(" "));
    }

    // instantiating class
    instance = Object.create(that);

    // invoking .init
    // initializing instance properties
    if (typeof that.init === 'function') {
      // running instance initializer
      that.init.apply(instance, arguments);
    }

    // caching instance (if necessary)
    if (mapper) {
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

    // adding / overwriting properties
    this._addPropertiesToClass(batch);

    // adding wrapper method when necessary
    this._addWrapperMethodsToClass(batch);

    // updating missing methods names
    this._removeFromMissingMethods(batch);

    // delegating batch to includers
    this._delegateToIncluders(batch);

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
   * Specifies a class to be included by the host class.
   * @param {$oop.Class} Class
   * @param {$oop.Class} [Through]
   * @returns {$oop.Class}
   */
  include: function (Class, Through) {
    $assert.isClass(Class, "Class#include expects type Class.");

    // todo Detect & throw on circular include

    // adding to downstream includes
    this._addToIncludes(Class);

    // adding to upstream includes
    Class._addToIncluders(this);

    // determining how include affects distances
    this._updateClassDistances(Class);

    // rebuilding forwards information
    this._updateForwards();

    // adding included class to contributions
    this._addToContributors(Class, Through);

    // removing fulfilled require
    this._removeFromRequires(Class);

    // transferring includes & requires from include
    this._transferRequiresFrom(Class);

    // transferring as include to extenders
    this._transferIncludeToExtenders(Class);

    var members = Class.__members;

    // adding methods to lookup at specified index
    this._addMethodsToMatrix(members, Class.__classId, Through && Through.__classId);

    // adding / overwriting properties
    this._addPropertiesToClass(members);

    // adding wrapper method when necessary
    this._addWrapperMethodsToClass(members);

    // updating missing method names
    this._removeFromMissingMethods(members);

    return this;
  },

  /**
   * Includes specified class and all its includes, direct or indirect.
   * @param {$oop.Class} Class
   * @returns {$oop.Class}
   */
  extend: function (Class) {
    // gathering all dependencies (including Class)
    var that = this,
      contributors = this._gatherAllContributorsFrom(Class);

    // including all dependencies
    contributors.forEach(function (Class) {
      // adding current class to include as extender
      Class._addToExtenders(that);

      that.include(Class);
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
   * Specifies a required base, or trait of the host class.
   * Used by traits only.
   * @param {$oop.Class} Class
   * @returns {$oop.Class}
   */
  require: function (Class) {
    $assert.isClass(Class, "Class#require expects type Class.");

    // adding require to registry
    this._addToRequires(Class);

    // adding to hosts on require
    Class._addToHosts(this);

    // transferring includes & requires from require
    this._transferRequiresFrom(Class);

    return this;
  },

  /**
   * Forwards the class to the specified class, if
   * constructor arguments satisfy the supplied filter.
   * @param {$oop.Class} Class
   * @param {function} filter
   * @returns {$oop.Class}
   */
  forward: function (Class, filter) {
    $assert.isClass(Class, "Class#forward expects type Class.");

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
   * Specifies a mapper function to be used to build a registry
   * @todo Rename
   * @todo Propagate to includers
   * @param {function} mapper
   * @returns {$oop.Class}
   */
  cache: function (mapper) {
    $assert.isFunction(mapper, "Class#cache expects function argument.");

    this.__mapper = mapper;

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
  isImplementedBy: function (Class) {
    return $oop.Class.isPrototypeOf(Class) &&
      Class.implements(this);
  },

  /**
   * Tells whether current class is or includes the specified class.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  includes: function (Class) {
    $assert.isClass(Class, "Class type expected");

    var classId = Class.__classId;

    return this.__classId === classId ||
      !!this.__includes.downstream.lookup[classId];
  },

  /**
   * Tells whether the specified class includes the current class.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  isIncludedBy: function (Class) {
    return $oop.Class.isPrototypeOf(Class) &&
      Class.includes(this);
  },

  /**
   * Tells whether current class requires the specified class.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  requires: function (Class) {
    $assert.isClass(Class, "Class type expected");

    return !!this.__requires.downstream.lookup[Class.__classId];
  },

  /**
   * Tells whether specified class requires the current class.
   * @param {$oop.Class} Class
   * @returns {boolean}
   */
  isRequiredBy: function (Class) {
    return $oop.Class.isPrototypeOf(Class) &&
      Class.requires(this);
  },

  /**
   * Binds and stores the specified methods on the instance, so they're
   * reusable as callbacks.
   * @param {...string} methodName
   * @returns {$oop.Class}
   */
  elevateMethods: function (methodName) {
    var argumentCount = arguments.length,
      i, method;

    for (i = 0; i < argumentCount; i++) {
      methodName = arguments[i];
      if (hOP.call(this, methodName)) {
        $assert.assert(false, "Method '" + this.__classId + "#" + methodName + "' already elevated.");
      } else {
        method = this[methodName];
        if (typeof method !== 'function') {
          $assert.assert(false, [
            "Method '" + this.__classId + '#' + methodName + "' not a function.",
            "Can't elevate."
          ].join(" "));
        } else {
          this[methodName] = this[methodName].bind(this);
        }
      }
    }

    return this;
  }
});

/**
 * @param {$oop.Class} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isClass = function (expr, message) {
  return $assert.assert(
    $oop.Class.isPrototypeOf(expr), message);
};

/**
 * @param {$oop.Class} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isClassOptional = function (expr, message) {
  return $assert.assert(
    expr === undefined ||
    $oop.Class.isPrototypeOf(expr), message);
};
