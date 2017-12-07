"use strict";

/**
 * @function $module.ModuleEnvironment.create
 * @returns {$module.ModuleEnvironment}
 */

/**
 * Allows `EventSubscriber` instances to subscribe to all module events.
 * @class $module.ModuleEnvironment
 * @extends $event.EventListener
 */
$module.ModuleEnvironment = $oop.createClass('$module.ModuleEnvironment')
.blend($oop.Singleton)
.blend($event.EventListener)
.define(/** @lends $module.ModuleEnvironment# */{
  /** @ignore */
  init: function () {
    this.setListeningPath('module');
  }
})
.build();
