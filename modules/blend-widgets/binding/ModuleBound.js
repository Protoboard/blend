"use strict";

/**
 * Binds host widget class to module loading events through a predefined
 * event handler method.
 * @mixin $widgets.ModuleBound
 * @augments $widget.Widget
 */
$widgets.ModuleBound = $oop.getClass('$widgets.ModuleBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.ModuleBound# */{
  /**
   * Updates parts of the widget's state that depend on the available modules.
   * To be optionally implemented by host class.
   * @function $widgets.ModuleBound#syncToAvailableModules
   */

  /** @ignore */
  onAttach: function () {
    if (this.syncToAvailableModules) {
      this.syncToAvailableModules();
      this.on(
          $module.EVENT_MODULE_AVAILABLE,
          $module.ModuleEnvironment.create(),
          this.onModuleAvailable);
    }
  },

  /** @ignore */
  onModuleAvailable: function () {
    this.syncToAvailableModules();
  }
});
