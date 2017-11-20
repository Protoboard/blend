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
  /** @ignore */
  onAttach: function () {
    this.syncToAvailableModules();
    this.on(
        $module.EVENT_MODULE_AVAILABLE,
        $module.ModuleEnvironment.create(),
        this.onModuleAvailable);
  },

  /**
   * Updates parts of the widget's state that depend on the available modules.
   * @ignore
   */
  syncToAvailableModules: function () {},

  /** @ignore */
  onModuleAvailable: function () {
    this.syncToAvailableModules();
  }
});
