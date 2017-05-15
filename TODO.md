GIANT TO DO
===========

Widget
------

- Better widget ordering
- Events after removal

Routing
-------

- When module gets loaded, look at current route & activate if necessary.
    - Depends on module management.

Event
-----

- Eliminate "next payload" - makes things untraceable
- Diagnostic add-on
    - Collecting processing history (ClassID + function)
- Evented.triggers(eventName):Promise

Data
----

- Specified collections? Keep 'em?
- mapKeys() on Dictionary only
- KVPCollection

Utils
-----

- Classes to be made `Destroyable`?

OOP
---

- **Full overrides**
- Checks
    - ~~Do not allow instances as static properties in Class#define~~
    - Whether forward includes class being instantiated. ON instantiation
    - Property vs. method collisions
    - Circular include
- _What if includes have conflicting hash functions?_
    - ATM not taken into account!
    - Includes' hash shouldn't matter?
- Terminology
    - include vs. integrate / mix
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
