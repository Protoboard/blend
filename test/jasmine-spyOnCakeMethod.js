/**
 * For spying on methods on class (mixin) level. Requires modified jasmine-core.
 * @param {$oop.Class} cakeClass
 * @param {string} methodName
 * @returns {jasmine.Spy}
 */
jasmine.spyOnCakeMethod = function (cakeClass, methodName) {
  var spy = spyOn(cakeClass, methodName),
      env = jasmine.getEnv(),
      currentSpies = env.spyRegistry.currentSpies();

  // collecting affected class / method pairs
  cakeClass.__mixins.upstream.list
  .filter(function (Class) {
    return Class.hasOwnProperty(methodName);
  })
  // replacing methods with spy
  .forEach(function (Class) {
    var originalFunction = Class[methodName];
    currentSpies.push({
      restoreObjectToOriginalState: function () {
        Class[methodName] = originalFunction;
      }
    });
    Class[methodName] = spy;
  });

  return spy;
};