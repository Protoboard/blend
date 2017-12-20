beforeAll(function () {
  jasmine.addCustomEqualityTester(function compareInstances(a, b) {
    if (a instanceof Object &&
        a.__builder instanceof Object &&
        typeof a.equals === 'function'
    ) {
      return a.equals(b);
    }
  });
});
