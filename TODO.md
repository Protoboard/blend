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

Utils
-----

- Take apart Managed? Destroyable interface + Identifiable + Registered?
- Scheduler
    - Drop delay from Scheduler ctr args? (requestAnimationFrame) It's already optional.

OOP
---

- **Extension that brings all includes of the 'base' with it.**
    - Traversing & collecting all includes
    - Additional method Class#extend
- _What if includes have conflicting hash functions?_
    - ATM not taken into account!
- Full overrides
- Checks
    - ~~Do not allow instances as static properties in Class#define~~
    - Whether forward includes class being instantiated. ON instantiation
    - Property vs. method collisions
- Refactoring
    - Consolidating meta containers
- Investigate runtime class / instance composition.
    - Costly is OK.
    - GUID as Class ID for ad-hoc classes?
        - How would we clean it up?
        - Not caching builder / class?
- Low pri: Make class meta properties non-enumerable
    - Modify `$oop.copyProperties()` to use a common descriptor.
- Low pri: Make `$oop.Base` a Class for compatibility, but make sure overrides are in place
- Low pri: Swap back contribution vs. delegate terminology
- Terminology
    - include vs. integrate / mix
    - "host": isHostedBy

Assert
------

Grunt
-----

- Generating source maps
