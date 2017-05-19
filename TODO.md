GIANT ToDo
==========

Widget
------

- Better widget ordering
- Events after removal

Routing
-------

- When module gets loaded, look at current route & activate if necessary.
    - Depends on module management.

Entity
------

- PaginatedCollection / BigCollection
    - To have page ID in event path
    - Maintains page ID array
- Entity#whenAvailable -> Promise

Event
-----

- Eliminate "next payload" - makes things untraceable
- Diagnostic add-on
    - Collecting processing history (ClassID + function)
- Evented#whenTriggers(eventName):Promise
- Mandatory #originalEvent on giant events

Data
----

- Document @callback's
- **Collection.of()**
- mapKeys() on Dictionary only
- KVPCollection
    - Collection#inflate()
    - Collection#deflate()

Utils
-----

- Classes to be made `Destroyable`?

OOP
---

- Typedefs
    - $oop.Registry
    - $oop.BidirectionalRegistry
- Full overrides
- Break down Class.js
- **Auto-priority for forwards**
    - Updating forwards array on include & forward addition
- Checks
    - ~~Do not allow instances as static properties in Class#define~~
    - Whether forward includes class being instantiated. ON instantiation
    - Property vs. method collisions
    - Circular include
- _What if includes have conflicting hash functions?_
    - ATM not taken into account!
    - Includes' hash shouldn't matter?
- Terminology
    - replace "include" with "mixin"
    - "host": isHostedBy

### Low Pri
 
- Single meta property?
- Performance benchmarks
- Investigate runtime class / instance composition.
    - Costly is OK.
    - GUID as Class ID for ad-hoc classes?
        - How would we clean it up?
        - Not caching builder / class?
- Make `$oop.Base` a Class for compatibility, but make sure overrides are in place
- Swap back contribution vs. delegate terminology

Assert
------

Grunt
-----

- Generating source maps
