(function () {
  var env = jasmine.getEnv(),
      spyOn = env.spyOn;

  env.spyOn = function (obj, methodName) {
    if ($oop.Klass.isPrototypeOf(obj)) {
      return spyOnObjects(obj.__builder.mixins.upstream.list
      .filter(function (Class) {
        return Class.hasOwnProperty(methodName);
      })
      .concat([obj]), methodName);
    } else {
      return spyOn(obj, methodName);
    }
  };
}());