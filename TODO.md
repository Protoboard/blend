GIANT TO DO
===========

Widget
------

- Better widget ordering

Utils
-----

OOP
---

- Full overrides
- Extension that brings all includes of the 'base' with it.
    - Traversing & collecting all includes
    - Additional method Class#extend
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
- Low pri: Make `$oop.Base` a Class for compatibility, but make sure overrides are in place
- Low pri: Swap back contribution vs. delegate terminology
- Low pri: Propagation of missing methods to implementers

Assert
------

Grunt
-----

- Generating source maps
