Blend
=====

**Blend is a foundation for client applications.** It's platform agnostic at 
its core, currently with focus on web User Interfaces.

Blend follows and promotes a component oriented architecture across the 
entire application stack, from API integration to UI widgets. It's made up of
15 modules that cover almost everything a modern client application needs.

Blend is heavily object-oriented, but instead of relying on the 
language's built-in OOP features, classes are based on Blend's very own
*mixin-only* OOP. (Hence the name.) In this paradigm, conflicting 
properties and methods coming from multiple mixins are resolved by 
superposition rather than override. This makes building classes very simple, 
as well as their behavior predictable.

Blend is event-based. The event mechanism decouples components and permeates 
all higher-level modules, serving as the nervous system of the application.

Getting started
---------------

### Setup

Your app will be the extension of Blend.

1. Fork and clone the repo (https://github.com/Protoboard/blend or
https://bitbucket.org/protoboard/blend)
2. `npm install`
3. Start adding your modules.

### Modules

- `grunt add-module` **NOT IMPLEMENTED**

### Build

- `grunt build-full` builds, runs tests, generates documentation
- `grunt build-quick` builds

Build artifacts will be placed under each module's "lib" folder as well as in
 "public".

### Tests

- `grunt test` lints, generates coverage, and module-by-module tests
- `grunt jshint` lints only
- `grunt karma:coverage` generates coverage only

Coverage will be placed in folder "doc/coverage".

### API Documentation

- `grunt doc` generates API documentation

Documentation will be placed in folder "doc/api".
