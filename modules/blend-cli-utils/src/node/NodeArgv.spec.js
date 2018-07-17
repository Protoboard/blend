"use strict";

var $oop = window['blend-oop'],
    $cliUtils = window['blend-cli-utils'];

describe("$cliUtils", function () {
  describe("NodeArgv", function () {
    var NodeArgv,
        nodeArgv;

    beforeAll(function () {
      NodeArgv = $oop.createClass('test.$cliUtils.NodeArgv.NodeArgv')
      .blend($cliUtils.NodeArgv)
      .build();
      NodeArgv.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize nodePath", function () {
        nodeArgv = NodeArgv.create({
          argumentList: ['/path/to/node', '/path/to/script', 'foo', 'bar']
        });
        expect(nodeArgv.nodePath).toBe('/path/to/node');
      });

      it("should initialize scriptPath", function () {
        nodeArgv = NodeArgv.create({
          argumentList: ['/path/to/node', '/path/to/script', 'foo', 'bar']
        });
        expect(nodeArgv.scriptPath).toBe('/path/to/script');
      });
    });
  });
});
