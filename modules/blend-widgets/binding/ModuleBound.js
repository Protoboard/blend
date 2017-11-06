"use strict";

/**
 * Binds host widget class to module loading events through a predefined
 * event handler method (`onModuleAvailable`).
 * @mixin $widgets.ModuleBound
 * @augments $widget.Widget
 */
$widgets.ModuleBound = $oop.getClass('$widgets.ModuleBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.ModuleBound# */{
  /**
   * @function $widgets.ModuleBound#onModuleAvailable
   * @param {$event.Event} event
   */

  /** @ignore */
  onAttach: function () {
    if (this.onModuleAvailable) {
      this.on(
          $module.EVENT_MODULE_AVAILABLE,
          $module.ModuleEnvironment.create(),
          this.onModuleAvailable);
    }
  }
});
