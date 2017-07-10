Layercake ToDo
==============

Diagnostic tools
----------------

- Widget tree inspection
- Widget ID inspection
- Entity key inspection
- Event trail
    - a tree structure that adds a path every time an event is triggered 
    (with counts optionally)
    - property on `Event` holding a list of class/method references that have
     processed the event so far
- Event bubbling slowdown

Widget
------

- Better widget ordering
- Events after removal
- Disabling / enabling global watchers(hotkey etc)

API
----

- Come up with a solution for query params re. endpoint lookups
    - Tagging entities by query params? (in index)

Routing
-------

- Break up classes into mixins
    - State management
    - Manifestation (URL hash, pushstate)
- When module gets loaded, look at current route & activate if necessary.
    - Depends on module management.
- Investigate `window.onBeforeUnload`
- Store Route subclass as state in `pushState`, that has a serial number.
    (Routes need to be identifiable re. where they are in the browser history)
- Distinguish routing events based on whether it's a genuine navigation, or 
moving within history

I18n
----

- Support contexts

Entity
------

- PaginatedCollection / BigCollection
    - To have page ID in event path
    - Maintains page ID array
- Entity#whenAvailable -> Promise
- Any entity change should broadcast, distributing before / after nodes
- Built-in invalidation
- Built-in backups

### Reboot

- **`#setNode`, `#appendNode` to distribute changes to sub-entities**
    - `Document` to fields
    - `CollectionField` to items
    - *Low pri* Document type to documents
    - *Low pri* Full store replacement to document types
    - *When available* Table to rows
- Additional `StringSet` based on KeyValueContainer?
    - for detecting changes

Event
-----

- `propagationPaths` & `setPropagationPaths`
    - for altering propagation
- Replace `propagates` flag w/ `bubblingDistance` or `bubblingDepth`
    - `Infinity` for bubbling all the way
    - defaults to 0
- Broadcasting to invoke handlers - instead of triggering event(s)
    - problem in conj. w/ #whenTriggers?
- Evented#whenTriggers(eventName):Promise
- ~~Ditch~~
    - ~~delegation~~
    - ~~one-off subscription~~ (substitute w/ .whenTriggers)
    - ~~"next payload" - makes things untraceable~~
- ~~Mandatory #originalEvent on giant events~~

### Performance

- Store `OrderedStringList` instance on 'path.eventName' nodes in 
`subscriptions`

### Low Pri

- Set `Evented#eventPath(s)` on first trigger?
- Revisit EventSource#on/#off method signature
- Diagnostic add-on
    - Collecting processing history (ClassID + function)
    - Storing class/method information on subscriptions
- `Evented` to `EventNode`?
    - multiple 'event paths'
    - requires `Identifiable` or `Retrievable`

Data
----

- Add wrapped alternatives for item access methods.
- Return markers in queries 
    - Querying subtrees matching pattern `(foo).(**).(bar)
    - return as
        - Collection for full paths only
        - Tree for multiple markers
        - Dictionary for everything query with markers
- Active conversions
    - KeyValueList (DataContainer)
        - DataContainer#toKeyValueList(process)
    - DataContainer#toDictionary(process)
- **ItemContainer.of()**
- KeyValuePair typedef
- DataContainer to allow primitives? If it doesn't, what's the point of 
having it?
- `StringSet#splitWith()` - returns left & right diff + intersection

### Low Pri

- `$data.shallowEquals` & `$data.deepEquals`
- empty objects as leaf nodes?
- optionally burrowing into matched nodes? (continue/stop - marker?)
- regexp key matcher
- Document @callback's

Utils
-----

- Classes to be made `Destructible`?
- **Promise chaining** (Think overrides returning promise)
    - Look into other promise specs (B/etc)

OOP
---

- Full overrides (`Class.override()`)
- Shorthand for singletons (`.singleton()`)
- Instant tester (`.isIntance()`)
- **BUG** Mapper doesn't propagate to includers
- Move cached instances to global lookup
- Single CTR arg: lookup of properties
- Tie built-in extensions to 'dev' flag
- **Merge interfaces into mixins (as all abstract)**
    - add $oop.abstract as special function
- Merging property overrides:
    - objects: deep tree merge
    - string / XML: XML tree merge
    - string / JSON: string JSON merge
- Typedefs
    - $oop.Registry
    - $oop.BidirectionalRegistry
- Break down Class.js
- Checks
    - ~~Do not allow instances as static properties in Class#define~~
    - Whether forward includes class being instantiated. ON instantiation
    - Property vs. method collisions
    - Circular include
    - Circular require
    - Member conflict in `define` / `_addToMembers`
- _What if includes have conflicting hash functions?_
    - Concatenate hashes

### Low Pri

- Separating ClassBuilder from Class?
    - reference from class to `__builder`
    - meta properties to be normal private on builder
    - keep tester methods on class? - provide static NS global alternatives
    `$foo.Foo = $oop.getClass('$foo.Foo');`
    `$oop.getClassBuilder('$foo.Foo').define(...)...`
- Per-method memoization
    - How to set method to be memoized?
- Integrate `$utils.Identifiable`, `$utils.Retrievable`, and `$utils
.Destroyable` into `Class`
    - so we can store class / instance information on methods
    - affects event subscriptions in `$event`
- Compacting methodMatrix on first `create()`
- Turning off contributors at runtime?
    - `inhibitContributor` - would require instance level copies.
- Performance benchmarks
- Make `$oop.Base` a Class for compatibility, but make sure overrides are in place
- Swap back contribution vs. delegate terminology

Assert
------

Grunt
-----

- Auto-generate asset list(s) in manifest (except for $oop & $asset)
- LESS