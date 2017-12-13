beforeAll(function () {
  jasmine.addCustomEqualityTester(function bypassBoundFunctions(a, b) {
    var whiteSpaceStripper = /\s/g,
        nativeFunctionString = "function(){[nativecode]}";

    if (typeof a === 'function' && typeof b === 'function' &&
        a.toString().replace(whiteSpaceStripper, '') === nativeFunctionString &&
        b.toString().replace(whiteSpaceStripper, '') === nativeFunctionString
    ) {
      console.warn("Bypassing comparison of bound functions.");
      return true;
    }
  });
});