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
   * @protected
   */
  _syncToAvailableModules: function () {},

  /** @ignore */
  onAttach: function () {
    this._syncToAvailableModules();
    this.on(
        $module.EVENT_MODULE_AVAILABLE,
        $module.ModuleEnvironment.create(),
        this.onModuleAvailable);
  },

  /** @ignore */
  onModuleAvailable: function () {
    this._syncToAvailableModules();
  }
});
