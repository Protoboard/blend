(function () {
  var env = jasmine.getEnv(),
      spyOn = env.spyOn;

  env.spyOn = function (obj, methodName) {
    if ($oop.Class.isPrototypeOf(obj)) {
      var affectedClasses = obj.__builder.mixins.upstream.list
      .filter(function (mixerBuilder) {
        return mixerBuilder.Class.hasOwnProperty(methodName);
      })
      .map(function (affectedBuilder) {
        return affectedBuilder.Class;
      })
      .concat([obj]);
      return spyOnObjects(affectedClasses, methodName);
    } else {
      return spyOn(obj, methodName);
    }
  };
}());